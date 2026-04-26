import Gio from "gi://Gio";
import GObject from "gi://GObject";
import { spawnCommandLine } from "resource:///org/gnome/shell/misc/util.js";
import * as QuickSettings from "resource:///org/gnome/shell/ui/quickSettings.js";
import * as PopupMenu from "resource:///org/gnome/shell/ui/popupMenu.js";

const statusPattern =
  /(Connected|Connecting|Disconnected|Registration Missing|No Network)/;

const WARPStatus = Object.freeze({
  Connected: "Connected",
  Connecting: "Connecting",
  Disconnected: "Disconnected",
  "Registration Missing": "Registration Missing",
  "No Network": "No Network",
  Error: "Error",
});

const WARPToggle = GObject.registerClass(
  class WARPToggle extends QuickSettings.QuickMenuToggle {
    _init(extensionObject) {
      super._init({
        title: "WARP",
        gicon: Gio.icon_new_for_string(
          extensionObject.path + "/icons/cloudflare-symbolic.svg"
        ),
      });

      this.menu.setHeader(
        Gio.icon_new_for_string(extensionObject.path + "/icons/cloudflare-symbolic.svg"),
        "WARP Settings"
      );

      // Connection Summary
      this._summaryItem = new PopupMenu.PopupMenuItem("Loading settings...", { reactive: false });
      this.menu.addMenuItem(this._summaryItem);
      this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

      const setupItem = (item, id) => {
        item._id = id;
        item.setOrnament(PopupMenu.Ornament.NONE);
      };

      // Mode menu
      this._modeItem = new PopupMenu.PopupSubMenuMenuItem("Mode");
      this.menu.addMenuItem(this._modeItem);
      
      this._modeItems = [];
      const addMode = (label, id, cmd) => {
        let item = new PopupMenu.PopupMenuItem(label);
        item.connect("activate", () => {
          spawnCommandLine(cmd);
          this._updateSettings(); // update checkmarks after click
        });
        setupItem(item, id);
        this._modeItem.menu.addMenuItem(item);
        this._modeItems.push(item);
      };

      addMode("WARP", "Warp", "warp-cli mode warp");
      addMode("WARP with DoH", "WarpWithDnsOverHttps", "warp-cli mode warp+doh");
      addMode("WARP with DoT", "WarpWithDnsOverTls", "warp-cli mode warp+dot");
      addMode("DNS only via DoH", "DnsOverHttps", "warp-cli mode doh");
      addMode("DNS only via DoT", "DnsOverTls", "warp-cli mode dot");
      addMode("Proxy Mode", "Proxy", "warp-cli mode proxy");
      addMode("Tunnel Only", "TunnelOnly", "warp-cli mode tunnel_only");

      // Protocol menu
      this._protocolItem = new PopupMenu.PopupSubMenuMenuItem("Protocol");
      this.menu.addMenuItem(this._protocolItem);

      this._protocolItems = [];
      const addProtocol = (label, id, cmd) => {
        let item = new PopupMenu.PopupMenuItem(label);
        item.connect("activate", () => {
          spawnCommandLine(cmd);
          this._updateSettings();
        });
        setupItem(item, id);
        this._protocolItem.menu.addMenuItem(item);
        this._protocolItems.push(item);
      };

      addProtocol("MASQUE", "MASQUE", "warp-cli tunnel protocol set MASQUE");
      addProtocol("WireGuard", "WireGuard", "warp-cli tunnel protocol set WireGuard");

      // Families menu
      this._familiesItem = new PopupMenu.PopupSubMenuMenuItem("1.1.1.1 for Families");
      this.menu.addMenuItem(this._familiesItem);

      this._familiesItems = [];
      const addFamilies = (label, id, cmd) => {
        let item = new PopupMenu.PopupMenuItem(label);
        item.connect("activate", () => {
          spawnCommandLine(cmd);
          this._updateSettings();
        });
        setupItem(item, id);
        this._familiesItem.menu.addMenuItem(item);
        this._familiesItems.push(item);
      };

      addFamilies("Off", "Off", "warp-cli dns families off");
      addFamilies("Malware protection", "Malware protection", "warp-cli dns families malware");
      addFamilies("Malware and adult content", "Malware and adult content", "warp-cli dns families full");

      this._openStateChangedId = this.menu.connect("open-state-changed", (menu, open) => {
        if (open) {
          this._updateSettings();
        }
      });
    }

    destroy() {
      if (this._openStateChangedId) {
        this.menu.disconnect(this._openStateChangedId);
        this._openStateChangedId = null;
      }
      super.destroy();
    }

    async _updateSettings() {
      try {
        const proc = Gio.Subprocess.new(
          ["warp-cli", "settings", "list"],
          Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
        );
        
        const stdout = await new Promise((resolve, reject) => {
          proc.communicate_utf8_async(null, null, (proc, res) => {
            try {
              let [, stdout, stderr] = proc.communicate_utf8_finish(res);
              if (proc.get_successful()) resolve(stdout);
              else reject(stderr);
            } catch (e) {
              reject(e);
            }
          });
        });

        // Parse stdout
        const modeMatch = stdout.match(/Mode:\s*(.+)/);
        const protocolMatch = stdout.match(/WARP tunnel protocol:\s*(.+)/);
        const resolveMatch = stdout.match(/Resolve via:\s*([^\s]+)/);

        let mode = modeMatch ? modeMatch[1] : "Unknown";
        let protocol = protocolMatch ? protocolMatch[1] : "MASQUE";
        let families = "Off";

        if (resolveMatch) {
          if (resolveMatch[1] === "security.cloudflare-dns.com") {
             families = "Malware protection";
          } else if (resolveMatch[1] === "family.cloudflare-dns.com") {
             families = "Malware and adult content";
          }
        }
        
        let modeDisplay = mode;
        if (mode === "Warp") modeDisplay = "WARP";
        else if (mode === "DnsOverHttps") modeDisplay = "DNS only via DoH";
        else if (mode === "WarpWithDnsOverHttps") modeDisplay = "WARP with DoH";
        else if (mode === "DnsOverTls") modeDisplay = "DNS only via DoT";
        else if (mode === "WarpWithDnsOverTls") modeDisplay = "WARP with DoT";
        else if (mode === "Proxy") modeDisplay = "Proxy Mode";
        else if (mode === "TunnelOnly") modeDisplay = "Tunnel Only";

        this._summaryItem.label.text = `${modeDisplay}  •  ${protocol}  •  ${families}`;

        // Update checks on menu items
        for (let item of this._modeItems) {
          item.setOrnament(item._id === mode ? PopupMenu.Ornament.DOT : PopupMenu.Ornament.NONE);
        }
        for (let item of this._protocolItems) {
          item.setOrnament(item._id === protocol ? PopupMenu.Ornament.DOT : PopupMenu.Ornament.NONE);
        }
        for (let item of this._familiesItems) {
          item.setOrnament(item._id === families ? PopupMenu.Ornament.DOT : PopupMenu.Ornament.NONE);
        }

      } catch(err) {
        logError(err);
      }
    }
  }
);

export var WARPIndicator = GObject.registerClass(
  class WARPIndicator extends QuickSettings.SystemIndicator {
    _init(extensionObject) {
      super._init();
      this._indicator = this._addIndicator();
      this._settings = extensionObject.getSettings();
      this._indicator.visible = false;
      this._indicator.gicon = Gio.icon_new_for_string(
        extensionObject.path + "/icons/cloudflare-symbolic.svg"
      );

      //Create a Toggle for QuickSettings
      this._toggle = new WARPToggle(extensionObject);
      this._toggle.connect("clicked", async () => {
        const wantsToConnect = !this._toggle.checked;

        // Instantly update the pill to avoid wait times
        if (wantsToConnect) {
          this.setStatus(true, WARPStatus.Connecting);
          spawnCommandLine(`warp-cli connect`);
        } else {
          this.setStatus(false, WARPStatus.Disconnected);
          spawnCommandLine(`warp-cli disconnect`);
        }

        if (!this._settings.get_boolean("status-check")) {
          this.updateStatusWhileConnecting();
        }
      });
    }

    async updateStatusWhileConnecting() {
      if ((await this.checkStatusAndUpdate()) != WARPStatus.Connecting) {
        clearTimeout(this._timeout);
        this._timeout = null;
        return;
      }

      //Checking every second while connecting. Prevents excessive CPU usage
      this._timeout = setTimeout(
        () => this.updateStatusWhileConnecting(),
        1000
      );
    }

    destroy() {
      this._settings = null;
      if (this._timeout) clearTimeout(this._timeout);
      this._timeout = null;
      this._indicator.destroy();
      super.destroy();
    }

    setStatus(isActive, optionalStatus) {
      this._indicator.visible = isActive;
      this._toggle.set({ checked: isActive, subtitle: optionalStatus });
    }

    async checkStatusAndUpdate() {
      try {
        const proc = Gio.Subprocess.new(
          ["warp-cli", "status"],
          Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
        );

        const stdout = await new Promise((resolve, reject) => {
          proc.communicate_utf8_async(null, null, (proc, res) => {
            try {
              let [, stdout, stderr] = proc.communicate_utf8_finish(res);
              if (proc.get_successful()) resolve(stdout);
              else reject(stderr);
            } catch (e) {
              reject(e);
            }
          });
        });

        const status = statusPattern.exec(stdout)?.[1];
        this.setStatus(status == WARPStatus.Connected, status);
        return WARPStatus[status];
      } catch (err) {
        this.setStatus(false, WARPStatus.Error);
        logError(err);
        return WARPStatus.Error;
      }
    }
  }
);

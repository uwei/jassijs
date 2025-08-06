


/*class Npm {
  registry = "https://registry.npmjs.org/";
  constructor() {
    fs = _require("fs", "")
  }

  async install() {
    debugger;
    const packageJson = this._loadPackageJson();
    const deps = packageJson.dependencies || {};

    for (const [modul, version] of Object.entries(deps)) {
      await this._installPackage(modul, version);
    }
  }

  async installModul(modul, version = "latest") {
    console.log("install " + modul);
    const pkg = this._loadPackageJson();
    pkg.dependencies = pkg.dependencies || {};
    pkg.dependencies[modul] = version;
    this._savePackageJson(pkg);
    await this._installPackage(modul, version);
  }

  async uninstallModul(modul) {
    const pkg = this._loadPackageJson();
    delete pkg.dependencies?.[modul];
    this._savePackageJson(pkg);
    this._deleteFolder(`./node_modules/${modul}`);
  }

  // 🔧 Helferfunktionen

  _loadPackageJson() {
    const content = fs.readFileSync("./package.json", "utf8");
    return JSON.parse(content);
  }

  _savePackageJson(obj) {
    const json = JSON.stringify(obj, null, 2);
    fs.writeFileSync("./package.json", json, "utf8");
  }

  resolveVersion(availableVersions, range) {
    const versions = Object.keys(availableVersions).filter(v => /^\d+\.\d+\.\d+$/.test(v));

    if (range === "*" || range === "latest") {
      return versions.sort((a, b) => this.compareVersions(b, a))[0];
    }

    const conditions = range.split(" ").filter(Boolean);

    const compatible = versions.filter(v => {
      const [major, minor, patch] = v.split(".").map(Number);

      return conditions.every(cond => {
        const match = cond.match(/(>=|<=|>|<|=|~|\^)?\s*(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
        if (!match) return false;

        const [, op, maj, min = "0", pat = "0"] = match;
        const target = [parseInt(maj), parseInt(min), parseInt(pat)];

        switch (op) {
          case ">": return this.compareVersions([major, minor, patch], target) > 0;
          case ">=": return this.compareVersions([major, minor, patch], target) >= 0;
          case "<": return this.compareVersions([major, minor, patch], target) < 0;
          case "<=": return this.compareVersions([major, minor, patch], target) <= 0;
          case "=": return this.compareVersions([major, minor, patch], target) === 0;
          case "^":
            return major === target[0] &&
              (minor > target[1] || (minor === target[1] && patch >= target[2]));
          case "~":
            return major === target[0] &&
              minor === target[1] &&
              patch >= target[2];
          default:
            return this.compareVersions([major, minor, patch], target) === 0;
        }
      });
    });

    if (compatible.length === 0) return null;

    compatible.sort((a, b) => this.compareVersions(b, a));
    return compatible[0];
  }

  compareVersions(a, b) {
    const [amaj, amin, apat] = Array.isArray(a) ? a : a.split(".").map(Number);
    const [bmaj, bmin, bpat] = Array.isArray(b) ? b : b.split(".").map(Number);
    if (amaj !== bmaj) return amaj - bmaj;
    if (amin !== bmin) return amin - bmin;
    return apat - bpat;
  }
  async _installPackage(name, version) {
    console.log("install package " + name);
    const metadata = await fetch(`${this.registry}${name}`).then(r => r.json());
    if(version.indexOf("@")>-1)
      version=version.split("@")[1];
    const resolvedVersion = this.resolveVersion(metadata.versions, version);
    if (metadata.versions[resolvedVersion]?.dist === undefined) {
      debugger;

      this.resolveVersion(metadata.versions, version);
    }
    const tarballUrl = metadata.versions[resolvedVersion].dist.tarball;

    const destPath = `./node_modules/${name}`;
    await this.unpacktgz(tarballUrl, destPath);

    const pkgPath = `${destPath}/package.json`;
    if (fs.existsSync(pkgPath)) {
      const subPkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      for (const [dep, depVersion] of Object.entries(subPkg.dependencies || {})) {
        if (!fs.existsSync(`./node_modules/${dep}`)) {
          await this._installPackage(dep, depVersion);
        }
      }
    }
  }

  _deleteFolder(path) {
    if (!fs.existsSync(path)) return;
    const walk = (p) => {
      for (const entry of fs.readdirSync(p)) {
        const full = `${p}/${entry}`;
        if (fs.statSync(full).isDirectory()) {
          walk(full);
          fs.rmdirSync(full);
        } else {
          fs.unlinkSync(full);
        }
      }
    };
    walk(path);
    fs.rmdirSync(path);
  }


  async unpacktgz(url, pathto) {
    const Buffer = _require("buffer", "");
    // var url = 'https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz';
    const response = await fetch(url);
    const compressedData = await response.arrayBuffer();

    const decompressed = pako.ungzip(new Uint8Array(compressedData));
    const path = _require('path', "");
    const files = await untar(decompressed.buffer);
    for (let x = 0; x < files.length; x++) {
      let fname = files[x].name.substring(files[x].name.indexOf("/") + 1);
      fname = pathto + "/" + fname;
      let dirname = path.dirname(fname);
      if (!fs.existsSync(dirname))
        fs.mkdirSync(dirname, { recursive: true });
      const buffer = Buffer.from(files[x].buffer);
      if (files[x].mode.trim() !== "000755")//directory
        fs.writeFileSync(fname, buffer);
    }

    return;
  }
}

function debug(rootPath) {
  const result = {};

  function scanDir(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = currentPath + "/" + entry.name;

      if (entry.isDirectory()) {
        scanDir(fullPath); // Rekursiv in Unterverzeichnis gehen
      } else if (entry.isFile()) {
        try {
          const content = fs.readFileSync(fullPath);
          const snippet = content.toString('utf8').slice(0, 10); // Erste 10 Zeichen
          result[fullPath] = snippet;
        } catch (err) {
          console.warn(`Fehler beim Lesen von ${fullPath}:`, err);
        }
      }
    }
  }

  scanDir(rootPath);
  return result;
}*/

class Npm {
  files:{[name:string]:any} = {};
  static textExt = ["js", "ts", "cfg", "xml", "json", "txt", "css", "map", "md", "npmignore", "nycrc", "css", "scss", "yml"]
  registry = "https://registry.npmjs.org/";
  installedModules = new Set();
  installingModules = new Map();
  requestedVersions = new Map();
  constructor(packagejson) {
    this.files["./package.json"] = {
      content: JSON.stringify(packagejson)
    };

  }

  async install() {
    const packageJson = this._loadPackageJson();
    const deps = packageJson.dependencies || {};

    // Parallele Installation
    await Promise.all(
      Object.entries(deps).map(([modul, version]) =>
        this._installPackage(modul, version)
      )
    );
  }

  async installModul(modul, version = "latest") {
    console.log("install Modul" + modul);
 
    const pkg = this._loadPackageJson();
    pkg.dependencies = pkg.dependencies || {};
    pkg.dependencies[modul] = version;
    this._savePackageJson(pkg);
    await this._installPackage(modul, version);
  }

  async uninstallModul(modul) {
    const pkg = this._loadPackageJson();
    delete pkg.dependencies?.[modul];
    this._savePackageJson(pkg);
    this._deleteFolder(`./node_modules/${modul}`);
  }

  _loadPackageJson() {
    const file = this.files["./package.json"];
    if (!file) throw new Error("package.json fehlt");
    return JSON.parse(file.content);
  }

  _savePackageJson(obj) {
    const json = JSON.stringify(obj, null, 2);
    this.files["./package.json"] = { content: new TextEncoder().encode(json) };
  }

  compareVersions(a, b) {
    const [amaj, amin, apat] = Array.isArray(a) ? a : a.split(".").map(Number);
    const [bmaj, bmin, bpat] = Array.isArray(b) ? b : b.split(".").map(Number);
    if (amaj !== bmaj) return amaj > bmaj ? 1 : -1;
    if (amin !== bmin) return amin > bmin ? 1 : -1;
    if (apat !== bpat) return apat > bpat ? 1 : -1;
    return 0;
  }

  resolveVersion(availableVersions, range) {
    const versions = Object.keys(availableVersions).filter(v => /^\d+\.\d+\.\d+$/.test(v));
    if (range === "*" || range === "latest") {
      return versions.sort((a, b) => this.compareVersions(b, a))[0];
    }

    const conditions = range.match(/(>=|<=|>|<|=|\^|~)?\s*\d+(?:\.\d+)?(?:\.\d+)?/g);
    if (!conditions) return null;

    const compatible = versions.filter(v => {
      const ver = v.split(".").map(Number);
      return conditions.every(cond => {
        const match = cond.match(/(>=|<=|>|<|=|\^|~)?\s*(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
        if (!match) return false;
        let [, op, maj, min = "0", pat = "0"] = match;
        const target = [parseInt(maj), parseInt(min), parseInt(pat)];
        const cmp = this.compareVersions(ver, target);
        switch (op) {
          case ">": return cmp > 0;
          case ">=": return cmp >= 0;
          case "<": return cmp < 0;
          case "<=": return cmp <= 0;
          case "=": return cmp === 0;
          case "^": return cmp >= 0 && ver[0] === target[0];
          case "~": return cmp >= 0 && ver[0] === target[0] && ver[1] === target[1];
          default: return cmp === 0;
        }
      });
    });

    if (compatible.length === 0) return null;
    compatible.sort((a, b) => this.compareVersions(b, a));
    return compatible[0];
  }
  async mergeVersionRanges(name) {
    const ranges = this.requestedVersions.get(name);
    if (!ranges || ranges.length === 0) return "latest";
  
    const metadata = await fetch(`${this.registry}${name}`).then(r => r.json());
    const available = metadata.versions;
  
    // Finde gemeinsame Version
    const compatible = Object.keys(available).filter(v => {
      return ranges.every(range => {
        const resolved = this.resolveVersion({ [v]: {} }, range);
        return resolved === v;
      });
    });
  
    if (compatible.length > 0) {
      compatible.sort((a, b) => this.compareVersions(b, a));
      return compatible[0];
    }
  
    // Keine gemeinsame Version → höchste angeforderte Version wählen
    console.log(`⚠ Keine gemeinsame Version für "${name}" gefunden. Verwende höchste angeforderte Version.`);
  
    const resolvedCandidates = ranges
      .map(range => this.resolveVersion(available, range))
      .filter(v => v !== null);
  
    if (resolvedCandidates.length === 0) {
      console.log(`❌ "${name}": Keine passende Version in Registry verfügbar.`);
      return null;
    }
  
    resolvedCandidates.sort((a, b) => this.compareVersions(b, a));
    return resolvedCandidates[0];
  }
  _isInstalledVersionCompatible(name, versionRange) {
    const pkgPath = `./node_modules/${name}/package.json`;
    const file = this.files[pkgPath];
    if (!file) return false;

    const installedPkg = JSON.parse(file.content);
    const installedVersion = installedPkg.version;
    const compatible = this.resolveVersion({ [installedVersion]: {} }, versionRange);
    return compatible === installedVersion;
  }

  async _installPackage(name, version) {
    if (!this.requestedVersions.has(name)) {
      this.requestedVersions.set(name, []);
    }
    this.requestedVersions.get(name).push(version);
  
    // Wenn Installation bereits läuft
    if (this.installingModules.has(name)) {
      return this.installingModules.get(name);
    }
  
    const installPromise = (async () => {
      const resolvedVersion = await this.mergeVersionRanges(name);
      if (!resolvedVersion) {
        console.log(`⚠ ${name}: keine gemeinsame Version gefunden`);
        return;
      }
  
      // Prüfen, ob bereits kompatibel installiert
      if (this._isInstalledVersionCompatible(name, resolvedVersion)) {
        return;
      }
  
      console.log(`⬇ installiere ${name}@${resolvedVersion}`);
      const metadata = await fetch(`${this.registry}${name}`).then(r => r.json());
      const tarballUrl = metadata.versions[resolvedVersion].dist.tarball;
      const destPath = `./node_modules/${name}`;
      await this.unpacktgz(tarballUrl, destPath);
  
      const pkgPath = `${destPath}/package.json`;
      if (this.files[pkgPath]) {
        const subPkg = JSON.parse(this.files[pkgPath].content);
        const subDeps = subPkg.dependencies || {};
  
        await Promise.all(
          Object.entries(subDeps).map(([dep, depVersion]) =>
            this._installPackage(dep, depVersion)
          )
        );
      }
  
      this.installedModules.add(name);
      this.installingModules.delete(name);
    })();
  
    this.installingModules.set(name, installPromise);
    return installPromise;
  }

  _deleteFolder(pathPrefix) {
    for (const path in this.files) {
      if (path.startsWith(pathPrefix)) {
        delete this.files[path];
      }
    }
  }

  async unpacktgz(url, pathto) {
    if (globalThis.pako === undefined) {
      const pcode = await (await fetch("https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js")).text();
      eval("var define=undefined;" + pcode);
    }
    const response = await fetch(url);
    const compressedData = await response.arrayBuffer();
    const decompressed = globalThis.pako.ungzip(new Uint8Array(compressedData));
    const reader = new TarReader();
    const files = reader.untar(decompressed.buffer);

    for (const entry of files) {

      let fname = entry.name.substring(entry.name.indexOf("/") + 1);
      fname = `${pathto}/${fname}`;
      if (entry.type !== "file") continue;
      let data;
      if (Npm.textExt.some(suffix => entry.name.toLowerCase().endsWith(suffix)))
        data = reader.getTextFile(entry.name);
      else
        data = reader.getFileBinary(entry.name);

      this.files[fname] = { content: data };
    }
  }
}
//https://github.com/ankitrohatgi/tarballjs/blob/master/tarball.js
var TarReader = class {
  buffer;
  fileInfo: any[];
  constructor() {
    this.fileInfo = [];
  }
  untar(buffer) {
    this.buffer = buffer;
    this.fileInfo = [];
    this._readFileInfo();
    return this.fileInfo;
  }
  readFile(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = (event) => {
        this.buffer = event.target.result;
        this.fileInfo = [];
        this._readFileInfo();
        resolve(this.fileInfo);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  readArrayBuffer(arrayBuffer) {
    this.buffer = arrayBuffer;
    this.fileInfo = [];
    this._readFileInfo();
    return this.fileInfo;
  }

  _readFileInfo() {
    this.fileInfo = [];
    let offset = 0;
    let file_size = 0;
    let file_name = "";
    let file_type = null;
    while (offset < this.buffer.byteLength - 512) {
      file_name = this._readFileName(offset); // file name
      if (file_name.length == 0) {
        break;
      }
      file_type = this._readFileType(offset);
      file_size = this._readFileSize(offset);

      this.fileInfo.push({
        "name": file_name,
        "type": file_type,
        "size": file_size,
        "header_offset": offset
      });

      offset += (512 + 512 * Math.trunc(file_size / 512));
      if (file_size % 512) {
        offset += 512;
      }
    }
  }

  getFileInfo() {
    return this.fileInfo;
  }

  _readString(str_offset, size) {
    let strView = new Uint8Array(this.buffer, str_offset, size);
    let i = strView.indexOf(0);
    let td = new TextDecoder();
    return td.decode(strView.slice(0, i));
  }

  _readFileName(header_offset) {
    let name = this._readString(header_offset, 100);
    return name;
  }

  _readFileType(header_offset) {
    // offset: 156
    let typeView = new Uint8Array(this.buffer, header_offset + 156, 1);
    let typeStr = String.fromCharCode(typeView[0]);
    if (typeStr == "0") {
      return "file";
    } else if (typeStr == "5") {
      return "directory";
    } else {
      return typeStr;
    }
  }

  _readFileSize(header_offset) {
    // offset: 124
    let szView = new Uint8Array(this.buffer, header_offset + 124, 12);
    let szStr = "";
    for (let i = 0; i < 11; i++) {
      szStr += String.fromCharCode(szView[i]);
    }
    return parseInt(szStr, 8);
  }

  _readFileBlob(file_offset, size, mimetype) {
    let view = new Uint8Array(this.buffer, file_offset, size);
    let blob = new Blob([view], { "type": mimetype });
    return blob;
  }

  _readFileBinary(file_offset, size) {
    let view = new Uint8Array(this.buffer, file_offset, size);
    return view;
  }

  _readTextFile(file_offset, size) {
    let view = new Uint8Array(this.buffer, file_offset, size);
    let td = new TextDecoder();
    return td.decode(view);
  }

  getTextFile(file_name) {
    let info = this.fileInfo.find(info => info.name == file_name);
    if (info) {
      return this._readTextFile(info.header_offset + 512, info.size);
    }
  }

  getFileBlob(file_name, mimetype) {
    let info = this.fileInfo.find(info => info.name == file_name);
    if (info) {
      return this._readFileBlob(info.header_offset + 512, info.size, mimetype);
    }
  }

  getFileBinary(file_name) {
    let info = this.fileInfo.find(info => info.name == file_name);
    if (info) {
      return this._readFileBinary(info.header_offset + 512, info.size);
    }
  }
};
 async function testNPM() {
  var npm = new Npm({
    "name": "jassijsserver",
    "version": "1.0.5",
    "description": "jassijsserver",
    "engines": {
      "node": "^12.x"
    },
    "dependencies": {
      "acorn-import-phases": "^1.0.4",
      "browserfs": "^1.4.3",
      "browserify": "^17.0.1",
    },
    "license": "MIT",
    "author": "Udo Weigelt",

  });
  debugger;
  //fs.writeFileSync("./package.json", pack);
  await npm.install();

  // console.log(debug("./test"));

  /*
    var pack = await new Server().loadFile("$serverside/package.json");
    fs.writeFileSync("./package.json", pack);
    await new Npm().install();
  */
  debugger;
  //await unpacktgz('https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz', "./test");

}

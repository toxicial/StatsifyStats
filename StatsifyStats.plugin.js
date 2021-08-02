/**
 * @name StatsifyStats
 * @author Toxicial
 * @version 1.0.8
 * @invite ZzBFTh4zhm
 * @donate https://www.patreon.com/statsify
 * @patreon https://www.patreon.com/statsify
 * @website https://statsify.net
 * @source https://github.com/toxicial/StatsifyStats/blob/main/StatsifyStats.plugin.js
 * @updateUrl https://raw.githubusercontent.com/toxicial/StatsifyStats/main/StatsifyStats.plugin.js
 */
 module.exports = (_ => {
  const config = {
		"info": {
			"name": "StatsifyStats",
			"author": "toxicial",
			"version": "1.0.8",
			"description": "Adds a Hypixel stats search within discord in the chat toolbar."
		},
		"rawUrl": `https://raw.githubusercontent.com/toxicial/StatsifyStats/main/StatsifyStats.plugin.js`,
		"changeLog": {
      "improved": {
        "Guild Member": "You are now able to click on a player thats in a guild and search them",
        "Guild Cacheing": "If your previous player search is in the same guild as your next search it'll load the guild members list without re-calling the api thus increasing the speed",
      },
      "fixed": {
        "Button": "Button disappears after edting a message",
        "Search Bar": "Search bar not working after updating plugin, or keeping discord on for a long period of time",
        "Crashing": "Fixed some bug crashing issues, report on github if any found"
      },
      "added": {
        "Arcade": "Arcade stats is now here",
      }
		}
	};

 
  return (window.Lightcord || window.LightCord) ? class {
		getName () {return config.info.name;}
		getAuthor () {return config.info.author;}
		getVersion () {return config.info.version;}
		getDescription () {return "Do not use LightCord!";}
		load () {BdApi.alert("Attention!", "By using LightCord you are risking your Discord Account, due to using a 3rd Party Client. Switch to an official Discord Client (https://discord.com/) with the proper BD Injection (https://betterdiscord.app/)");}
		start() {}
		stop() {}
	} : !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
		getName () {return config.info.name;}
		getAuthor () {return config.info.author;}
		getVersion () {return config.info.version;}
		getDescription () {return `The Library Plugin needed for ${config.info.name} is missing. Open the Plugin Settings to download it. \n\n${config.info.description}`;}
		
		downloadLibrary () {
			require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
				if (!e && b && r.statusCode == 200) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => BdApi.showToast("Finished downloading BDFDB Library", {type: "success"}));
				else BdApi.alert("Error", "Could not download BDFDB Library Plugin. Try again later or download it manually from GitHub: https://mwittrien.github.io/downloader/?library");
			});
		}
		
		load () {
			if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {pluginQueue: []});
			if (!window.BDFDB_Global.downloadModal) {
				window.BDFDB_Global.downloadModal = true;
				BdApi.showConfirmationModal("Library Missing", `The Library Plugin needed for ${config.info.name} is missing. Please click "Download Now" to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onCancel: _ => {delete window.BDFDB_Global.downloadModal;},
					onConfirm: _ => {
						delete window.BDFDB_Global.downloadModal;
						this.downloadLibrary();
					}
				});
			}
			if (!window.BDFDB_Global.pluginQueue.includes(config.info.name)) window.BDFDB_Global.pluginQueue.push(config.info.name);
		}
		start () {this.load();}
		stop () {}
		getSettingsPanel () {
			let template = document.createElement("template");
			template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The Library Plugin needed for ${config.info.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
			template.content.firstElementChild.querySelector("a").addEventListener("click", this.downloadLibrary);
			return template.content.firstElementChild;
		}    
        } : (([Plugin, BDFDB]) => {

          //code stats here

            let uuid;
            let user;
            let player;
            let guild;
            let rank;
            let plusColor;
            let formattedRank;
            let displayName;
            let body_guild_mcColor;
            let friends;
            let friendCount;
            let hyApi;
            let profiles;
            let guildtab;
            let gcolor;
            let guildGames;
            let petLevel;
            let petLoad;
            let totemLoad;
            let ptableLoad;
            let today;
            


            const insertCss = (css) => {
                const style = document.createElement('style');
                style.appendChild(document.createTextNode(css));
                document.head.appendChild(style);
                return style;
            }

            const createElm = (html) => {
                const temp = document.createElement('div');
                temp.innerHTML = html;
                return temp.removeChild(temp.firstElementChild);
            }

              insertCss(`
                  @import url('https://fontlibrary.org//face/minecraftia');
                  #statsify-btn{position: relative; height: 24px;width: auto;-webkit-box-flex: 0;-ms-flex: 0 0 auto;flex: 0 0 auto;margin: 11px 4px 9px 2px;cursor:pointer;}
                  #statsify{position:fixed;top:80px;right:16px;bottom:75px;width:900px;z-index:99;color:var(--text-normal);background-color:var(--background-secondary);padding-top: 16px;box-shadow:var(--elevation-stroke),var(--elevation-high);border-radius:8px;display:flex;flex-direction:column;transform-origin: bottom right;}
                  #statsify .header{padding:12px 16px;background-color:var(--background-tertiary);color:var(--text-muted)}
                  #statsify .navButtonActive-1MkytQ44444 {background-color: #202225;color: #fff;}
                  #statsify .topheader{font-weight: 900; padding: 7px 0px 0px 0px; font-size: 25px; cursor: default;}
                  #statsify .topheadermenu{font-weight: 900;font-size: 35px; cursor: default;position: relative;left: 373px;bottom: 8px;}
                  #statsify .cursor-default{cursor: default;}
                  #statsify .cursor-pointer{cursor: pointer;}
                  #statsify .navList-2UtuhC222222{display: -webkit-box;display: -ms-flexbox;display: flex; align-items: center;}
                  #statsify .navList-2UtuhC2222222{display: -webkit-box;display: -ms-flexbox;display: flex; align-items: center;}
                  #statsify .settings-icon1{height:20; width:20;position: relative;left: 558px;}
                  #statsify .settings-icon2{height:20; width:20;position: relative;left: 715px;bottom: 3px;}
                  #statsify .background-423432423423{border-radius: 10px;background-color: #2f3136;;padding: 0px 20px 45px 20px;margin: 35px 9px 9px 9px;}
                  #statsify .background-4234324234233{border-radius: 8px;background-image: url(https://media.discordapp.net/attachments/795726811648098354/852696099864444928/stootsifybg.png?width=904&height=300);background-repeat: no-repeat, repeat;background-position: center;padding: 0px 20px 0px 20px;height: 250px;background-size: cover;margin: 430px 0px 0px 0px;}
                  #statsify .back-arrow{position: relative !important;left: 558px;}
                  #statsify input:checked + .tab-label {background: #4f545c61;}
                  #statsify input:checked ~ .tab-content {max-height: 100%;padding: 1em;}
                  .hidden{display: hidden;background-color: rgba(0, 0, 0, 0);}
                  .top-section-name{display: flex; justify-content: center; margin-top: 20px;cursor:default;}
                  .displaynametext{font-family: 'MinecraftiaRegular'; font-size: 30px; margin-top: 12px; margin-left: 20px;}
                  .skull{border-radius: 8px;box-shadow: -1px 1px 10px 0px #18191c;}
                  .black {color: #000000;}
                  .black.shadow {text-shadow: 2px 2px #000000;}
                  .dark_blue {color: #0000AA;}
                  .dark_blue.shadow {text-shadow: 2px 2px #00002A;}
                  .dark_green {color: #00AA00;}
                  .dark_green.shadow {text-shadow: 2px 2px #002A00;}
                  .dark_aqua {color: #00AAAA;}
                  .dark_aqua.shadow {text-shadow: 2px 2px #002A2A;}
                  .dark_red{color: #AA0000;}
                  .dark_red.shadow{text-shadow: 2px 2px #2A0000;}
                  .dark_purple{color: #AA00AA;}
                  .dark_purple.shadow{text-shadow: 2px 2px #2A002A;}
                  .gold{color: #FFAA00;}
                  .gold.shadow{text-shadow: 2px 2px #2A2A00;}
                  .gray{color: #AAAAAA;}
                  .gray.shadow{text-shadow: 2px 2px #2A2A2A;}
                  .dark_gray{color: #555555;}
                  .dark_gray.shadow{text-shadow: 2px 2px #151515;}
                  .blue{color: #5555FF;}
                  .blue.shadow{text-shadow: 2px 2px #15153F;}
                  .green{color: #55FF55;}
                  .green.shadow{text-shadow: 2px 2px #153F15;}
                  .aqua{color: #55FFFF;}
                  .aqua.shadow{text-shadow: 2px 2px #153F3F;}
                  .red{color: #FF5555;}
                  .red.shadow{text-shadow: 2px 2px #3F1515;}
                  .light_purple{color: #FF55FF;}
                  .light_purple.shadow{text-shadow: 2px 2px #3F153F;}
                  .yellow{color: #FFFF55;}
                  .yellow.shadow{text-shadow: 2px 2px #3F3F15;}
                  .white{color: #FFFFFF;}
                  .white.shadow{text-shadow: 2px 2px #3F3F3F;}
                  .input56 {position: absolute;opacity: 0;z-index: -1;}
                  .row {display: flex;}
                  .row .col {flex: 1;}
                  .row .col:last-child {margin-top: 2em;margin-left: 1em;margin-right: 1em;}
                  .tab {border-radius: 10px;margin-bottom: 1em;width: 100%;color: #dcddde;text-shadow: 1px 1px 1px #202225;overflow: hidden;}
                  .tab-label {display: flex;justify-content: space-between;padding: 1em;background: #40444b;font-weight: bold;cursor: pointer;}
                  .tab-label:hover {background: #4f545c61;}
                  .tab-content {max-height: 0;padding: 0 1em;color: #dcddde;background: #32353b;transition: all 0.35s;position:sticky;}
                  .tab-close {display: flex;justify-content: flex-end;padding: 1em;font-size: 0.75em;background: #2c3e50;cursor: pointer;}
                  .tab-close:hover {background: #1a252f;}
                  .content-center{display:flex;justify-content:center;}
                  .lvl-gs{transform: scale(.6); margin-bottom: -10px}
                  .ap-gs{transform: scale(.6);}
                  .gs-res{display: grid;margin-bottom: 50px;text-align: center;grid-template-columns:346px 205px 274px;}
                  .gs-a{margin-right: 70px;}
                  .status{position:absolute;width:28px;margin-top:10px;margin-left:820px;}
                  .profiles{display:flex;justify-content:center;margin-bottom:10px;}
                  .profile{width:36px;cursor:pointer;}
                  .profile:hover{opacity: 0.93;}
                  .gtag{font-family: 'MinecraftiaRegular'; font-size: 30px;margin-bottom:1em;margin-left:10px;h}
                  .ggs-res{display: grid;margin-bottom: 50px;text-align: center;grid-template-columns:317px auto 243px;}
                  .guild-games{width:36px;cursor:help;box-shadow: -1px 1px 10px 0px #18191c;}
                  .stat-loader{margin-top:306.915px;}
                  .stat-loading{}
                  .plevel-progress {height: 1.7em;width: 100%;background-color: #282a2f;position: relative;border-radius: 7px;margin-bottom:2.5em}
                  .plevel-progress:before {content: attr(data-label);font-size: 0.8em;position: absolute;text-align: center;top: 7px;left: 0;right: 0;color: white;font-family: Minecraftia;text-shadow: -1px 2px 2px black;}
                  .plevel-progress .pvalue {border-radius: 7px;background-color: #147ccc; display: inline-block; height: 100%;box-shadow: -14px 2px 20px #282a2f;}
                  .totem {margin-top: 1em;display:flex;justify-content:center;counter-reset: step;}
                  .totembar li {list-style-type: none;width: 25%;float: left;font-size: 24px;position: relative;text-align: center;text-transform: uppercase;color: #a8f0d8;}
                  .totembar li:before {width: 30px;height: 30px;content: '';line-height: 30px;border: 2px solid #282a2f;background-color: #282a2f;display: block;text-align: center;margin: 0 auto 10px auto;border-radius: 50%;transition: all .8s;}
                  .totembar li:after {width: 100%;height: 2px;content: '';position: absolute;background-color: #282a2f;top: 16px;left: -50%;z-index: -1;transition: all .8s;}
                  .totembar li:first-child:after {content: none;}
                  .totembar li.active:before {border-color: #147ccc;background-color: #147ccc;transition: all .8s;box-shadow: -4px 2px 20px #282a2f;}
                  .totembar li.active:after {background-color: #147ccc;transition: all .8s;}
                  .ptable {border-collapse: collapse;width: 100%;}
                  #ptable td, th {border: 4px solid #0000;;text-align: center;padding: 8px;font-size: 19px;}
                  #ptable th {background-color:#147ccc;font-weight:bold;}
                  #ptable tr:nth-child(even) {background-color: #4f545c61;}
                  .gmtable {border-collapse: collapse;width: 100%;}
                  #gmtable td, th {border: 4px solid #0000;;text-align: center;padding: 8px;font-size: 15px;white-space: nowrap;}
                  #gmtable th {background-color:#147ccc;font-weight:bold;}
                  #gmtable tr:nth-child(even) {background-color: #4f545c61;}
                  .statsifyresize {cursor:help;height: 15px;left: -2px;position: absolute;top: 0px;width: 15px;z-index: 2;}
                  .arcade_table {margin: 0 auto;display: grid;grid-template-columns: repeat(auto-fit, minmax(1rem, 396px));align-items: center;column-gap: 2rem;row-gap: 2rem;max-width: 70em;justify-content:center;padding-top:20px;}
                  .arcade_package {border-radius: 15px;background: #36393f;box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);overflow: hidden;position: relative;color: #dcddde;height: 220px;display:grid;justify-content:center;text-align:center;padding-bottom:10px;}
                  .arcade_top{font-family: 'MinecraftiaRegular'; font-size: 25px;margin-bottom:.5em;}
                  .arcade_header{font-weight:bold;margin-top:10px;font-size: 17px;display:flex;justify-content:center;margin-bottom: 10px;}
                  .arcade_text{font-weight:bold;font-size: 15px;color: #dcddde;}
                  .arcade_stat{font-size: 15px;color: #dcddde;}
                  .arcade_div{margin-bottom:1px;}
                  .as_div{display: grid;grid-template-columns: 198px 200px;margin-bottom:3px;}
                  .as_middle{display: grid;justify-content:center;margin-top:5px;}
                  .zombie-table{position:absolute;right: 10px;background: #0000ff00;color: #dcddde;transform: scale(1.5);top: 8px;}
                  .zombie-table:hover{transform: scale(1.6)}
                  .zomtable {border-collapse: collapse;width: 100%;margin-top: 20px;}
                  #zomtable td, th {border: 4px solid #0000;;text-align: center;padding: 8px;font-size: 15px;white-space: nowrap;}
                  #zomtable th {background-color:#147ccc;font-weight:bold;}
                  #zomtable tr:nth-child(even) {background-color: #4f545c61;}

              `);


        // statsify button html
            const buttonHTML = createElm(`<div id="statsify-btn"  class="button-3AYNKbbbbb:hover button-3AYNKb" tabindex="0" role="button" aria-label="Search Players Stats" >
            <svg aria-hidden="false" width="38" height="38" viewBox="0 0 24 24">
                <path fill="currentColor" d="M 3.4 12.1 L 5.4 12.1 L 5.4 16.4 L 3.4 16.4 M 7.1 9.8 L 9.2 9.8 L 9.2 16.4 L 7.1 16.4 M 10.8 10.6 L 12.8 10.6 L 12.8 16.4 L 10.8 16.4 M 14.5 8.4 L 16.5 8.4 L 16.5 16.4 L 14.5 16.4 M 11.7 8.8 L 12.3992 8.7987 L 12 8.2 L 7.8002 6.5998 L 8.1 7.3 M 8.1 7.3 L 3.6 10.3 M 3.6 10.3 L 3.6 10.3 C 3.1 10.4 3.1 10 3.3 9.8 M 3.3 9.8 L 3.6 10.3 L 8.1 7.3 L 7.8 6.6 M 7.8 6.6 L 7.8 6.6 L 7.8 6.6 L 7.8002 6.5998 C 8 6.5 8.3 6.6 8.3 6.6 L 12 8.2 M 12 8.2 L 12 8.2 M 12 8.2 L 15.5984 4.3002 M 14.7056 4.2525 C 14.4986 4.1424 14.5236 3.6917 14.732 3.5111 L 16.8414 3.5292 L 16.8462 5.6958 L 16.8401 3.5261 L 16.8448 5.6932 L 16.1336 4.7866 L 16.0877 4.82 L 15.5983 4.3002 M 15.7088 4.0179 M 11.6999 8.8 C 12.0251 8.9187 12.0235 8.905 12.4 8.8 M 12.4003 8.7994 c 1.2292 -1.3272 2.4584 -2.6543 3.6876 -3.9815 C 16.088 4.8184 16.0887 4.8202 16.0881 4.8193 L 16.0874 4.8201 L 16.1125 5.6898 C 16.2859 5.9441 16.8311 5.8309 16.8443 5.6928 L 16.134 4.7862 L 16.0875 4.8196 L 15.5983 4.3002 L 15.5965 4.302 L 15.598 4.3007 L 12.0034 8.2011 Z M 8.3 6.6"></path>
            </svg>
            <br><progress style="display:none; width:24px;"></progress>
        </div>`);

        // popover menu
       const popover = createElm(`
        <div id="statsify" style="display:none;">
        <div title="you can change the window size through settings" class="statsifyresize"></div>
    <nav class="nav-7UD0KD">
       <div class="navList-2UtuhC222222" role="tablist" aria-label="Expression Picker">
          <div class="navItem-3Wp_oJ" role="tab" id="gif-picker-tab" aria-controls="gif-picker-tab-panel" aria-selected="true">
             <button aria-current="page" type="button" class="cursor-default no-drag navButton-2gQCx- navButtonActive-1MkytQ44444 button-38aScr lookBlank-3eh9lL colorBrand-3pXr91 grow-q77ONN">
                <img class="cursor-default"  width="36" height="36" src="https://media.discordapp.net/attachments/773408278562471957/852257787324006460/statsify.png" <img>
             </button>
          </div>
          <div class="navItem-3Wp_oJ" role="tab" id="emoji-picker-tab" aria-controls="emoji-picker-tab-panel" aria-selected="false">
             <button type="button" class="lookBlank-3eh9lL colorBrand-3pXr91 grow-q77ONN">
                <h7 class="topheader">Hypixel Stats Search</h7>
             </button>
          </div>
          <div class="back-arrow" id="back-arrow-icon" style="cursor: pointer;">
            <svg class="back-arrow-icon button-3AYNKb" width="36" height="36" viewBox="0 0 64 64">
                <path fill="none" d="M0 0h48v48h-48z"></path>
                <path fill="currentColor" d="M40 22h-24.34l11.17-11.17-2.83-2.83-16 16 16 16 2.83-2.83-11.17-11.17h24.34v-4z"></path>
            </svg>
          </div>
    </nav>
    <h6 style="height:8px; visibility:hidden;"></h6>
            <div class="header-1TOWci">
       <div class="flex-1xMQg5 flex-1O1GKY horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignCenter-1dQNNs noWrap-3jynv6" style="flex: 1 1 auto;">
          <div class="searchBar--fTZYa container-cMG81i medium-1LLV3p">
             <div class="inner-2P4tQO">
                <input maxlength="36" spellcheck="false" id="searchInput" class="input-3Xdcic" placeholder="Username/UUID" value="">
                <div class="iconLayout-3OgqU3 medium-1LLV3p" tabindex="-1" role="button">
                   <div class="iconContainer-2wXvy1">
                      <svg class="icon-1S6UIr visible-3bFCH-" aria-label="Search" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
                         <path fill="currentColor" d="M21.707 20.293L16.314 14.9C17.403 13.504 18 11.799 18 10C18 7.863 17.167 5.854 15.656 4.344C14.146 2.832 12.137 2 10 2C7.863 2 5.854 2.832 4.344 4.344C2.833 5.854 2 7.863 2 10C2 12.137 2.833 14.146 4.344 15.656C5.854 17.168 7.863 18 10 18C11.799 18 13.504 17.404 14.9 16.314L20.293 21.706L21.707 20.293ZM10 16C8.397 16 6.891 15.376 5.758 14.243C4.624 13.11 4 11.603 4 10C4 8.398 4.624 6.891 5.758 5.758C6.891 4.624 8.397 4 10 4C11.603 4 13.109 4.624 14.242 5.758C15.376 6.891 16 8.398 16 10C16 11.603 15.376 13.11 14.242 14.243C13.109 15.376 11.603 16 10 16Z"></path>
                         </svg>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
      <div class="container-2jxBbw thin-1ybCId scrollerBase-289Jih fade-2kXiP2" style="overflow: hidden scroll; padding-right: 0px;">
      <div id="bodyResult" class="content-3YMskv">
      </div>
      </div>
          </div>
        `);
    
        document.body.appendChild(popover);

            var apiKey = {};
            var popsize = {};
            var settings = {};
            var gcache = {};


            var colors = {
                "0": { color: "black" },
                "1": { color: "dark_blue" },
                "2": { color: "dark_green" },
                "3": { color: "dark_aqua" },
                "4": { color: "dark_red" },
                "5": { color: "dark_purple" },
                "6": { color: "gold" },
                "7": { color: "gray" },
                "8": { color: "dark_gray" },
                "9": { color: "blue" },
                a: { color: "green" },
                b: { color: "aqua" },
                c: { color: "red" },
                d: { color: "light_purple" },
                e: { color: "yellow" },
                f: { color: "white" },
              }

              var pet = {
                "1": 0,
                "2": 200,
                "3": 210,
                "4": 230,
                "5": 250,
                "6": 280,
                "7": 310,
                "8": 350,
                "9": 390,
                "10": 450,
                "11": 500,
                "12": 570,
                "13": 640,
                "14": 710,
                "15": 800,
                "16": 880,
                "17": 980,
                "18": 1080,
                "19": 1190,
                "20": 1300,
                "21": 1420,
                "22": 1540,
                "23": 1670,
                "24": 1810,
                "25": 1950,
                "26": 2100,
                "27": 2260,
                "28": 2420,
                "29": 2580,
                "30": 2760,
                "31": 2940,
                "32": 3120,
                "33": 3310,
                "34": 3510,
                "35": 3710,
                "36": 3920,
                "37": 4140,
                "38": 4360,
                "39": 4590,
                "40": 4820,
                "41": 5060,
                "42": 5310,
                "43": 5560,
                "44": 5820,
                "45": 6090,
                "46": 6360,
                "47": 6630,
                "48": 6920,
                "49": 7210,
                "50": 7500,
                "51": 7800,
                "52": 8110,
                "53": 8420,
                "54": 8740,
                "55": 9070,
                "56": 9400,
                "57": 9740,
                "58": 10080,
                "59": 10430,
                "60": 10780,
                "61": 11150,
                "62": 11510,
                "63": 11890,
                "64": 12270,
                "65": 12650,
                "66": 13050,
                "67": 13440,
                "68": 13850,
                "69": 14260,
                "70": 14680,
                "71": 15100,
                "72": 15530,
                "73": 15960,
                "74": 16400,
                "75": 16850,
                "76": 17300,
                "77": 17760,
                "78": 18230,
                "79": 18700,
                "80": 19180,
                "81": 19660,
                "82": 20150,
                "83": 20640,
                "84": 21150,
                "85": 21650,
                "86": 22170,
                "87": 22690,
                "88": 23210,
                "89": 23750,
                "90": 24280,
                "91": 24830,
                "92": 25380,
                "93": 25930,
                "94": 26500,
                "95": 27070,
                "96": 27640,
                "97": 28220,
                "98": 28810,
                "99": 29400,
                "100": 30000,
                "101": 32000
              }


            return class StatsifyStats extends Plugin {

              
                
                
                onLoad () {
                  this.defaults = {
                    popsize: {
                      size:				{value: 100,				description: "Popover window size"}
                    },
                    settings: {
                      guildmember:      {value: false,        name: "Display Guild Members"},
                      gexp:             {value: false,        name: "Display Weekly Gexp Instead of Daily"}
                    }
                  };
                    apiKey = BDFDB.DataUtils.load(this, "api");
                    popsize = BDFDB.DataUtils.get(this, "popsize");
                    settings = BDFDB.DataUtils.get(this, "settings");
                    gcache = BDFDB.DataUtils.load(this, "guildcache");
                    
                    

                    const searchField = document.getElementById("searchInput")
                    searchField.addEventListener('keyup', event => {
                    if (event.keyCode === 13) this.getUUID()
                    })

                    document.getElementById("back-arrow-icon").onclick = this.backArrow;

                    this.popoverSize()
                }
                
                onStart () {
                  this.forceUpdateAll();
                    const form = document.querySelector("form");
                    if (form) this.addButton(form);
                    BDFDB.PatchUtils.forceAllUpdates(this);

                    
                }
                
                onStop () {
                    const button = document.getElementById("statsify-btn");
                    if (button) button.remove();
                    if (popover) popover.remove();
                    BDFDB.PatchUtils.forceAllUpdates(this);
                }
       
    getSettingsPanel (collapseStates = {}) {
        
				let settingsPanel;
				return settingsPanel = BDFDB.PluginUtils.createSettingsPanel(this, {
					collapseStates: collapseStates,
					children: _ => {
						let settingsItems = [];
						
						settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.CollapseContainer, {
              title: "Settings",
              collapseStates: collapseStates,
              children:	BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.CollapseContainer, {
                title: "Guild Members",
                collapseStates: collapseStates,
                children: [Object.keys(settings).filter(n => n && n != "_all").map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
                    type: "Switch",
                    plugin: this,
                    keys: ["settings", key],
                    label: this.defaults.settings[key].name,
                    value: settings[key]
                  })),

                  BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Button, {
                    color: BDFDB.LibraryComponents.Button.Colors.RED,
                    style: {marginLeft: 175, marginTop: 20, padding: 20},
                    onClick: _ => {
                      BDFDB.ModalUtils.confirm(this, "Are you sure you want to remove all guild cache?", _ => {
                        BDFDB.DataUtils.remove(this, "guildcache");
                        BDFDB.PluginUtils.refreshSettingsPanel(this, settingsPanel, collapseStates);
                      });
                    },
                    children: "Clear All Guild Cache"
                  })
                ]    
              })
            }));
						settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.CollapseContainer, {
							title: "api key",
							collapseStates: collapseStates,
							children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Flex, {
								className: BDFDB.disCN.margintop8,
								align: BDFDB.LibraryComponents.Flex.Align.CENTER,
								children: [
									BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Flex.Child, {
										children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TextInput, {
											placeholder: "No Saved Api Key",
                      maxLength: 36,
											value: "",
                      value: BDFDB.DataUtils.load(this, "api"),
											onChange: value => apiKey = value
                                            
										})
									}),
									BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Button, {
										onClick: () => {
                    BDFDB.DataUtils.save(apiKey, this, "api");
                    this.getKey();
                                            
										},
                  children: BDFDB.LanguageUtils.LanguageStrings.SAVE
									}),

								]
							})
						}));
						settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.CollapseContainer, {
							title: "popover window size",
							collapseStates: collapseStates,
							children: Object.keys(popsize).map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
								type: "Slider",
                digits: 0,
								plugin: this,
								keys: ["popsize", key],
								basis: "100%",
                defaultValue: popsize[key],
                  onValueRender: value => {
                  return value + "%";
                  }
							}))
						}));
						
						return settingsItems;
					}
				});
			}

            onSettingsClosed () {
				if (this.SettingsUpdated) {
					delete this.SettingsUpdated;
					this.forceUpdateAll();
          this.popoverSize()
				}
			}

            forceUpdateAll () {
              popsize = BDFDB.DataUtils.get(this, "popsize");
              settings = BDFDB.DataUtils.get(this, "settings");
              gcache = BDFDB.DataUtils.load(this, "guildcache");

              const searchField = document.getElementById("searchInput")
              searchField.addEventListener('keyup', event => {
              if (event.keyCode === 13) this.getUUID()
              })

              document.getElementById("back-arrow-icon").onclick = this.backArrow;

              const form = document.querySelector("form");
              if (form) this.addButton(form);
                }
      

			getKey () {
				BDFDB.LibraryRequires.request(`https://api.hypixel.net/key?key=${apiKey}`, (err, res ) => {
                    const data = JSON.parse(res.body);
                    switch(res.statusCode){
                        case 200: {
                            BDFDB.NotificationUtils.toast("Success! Your Api Key is Set", {type: "success", position: "center"});
                          return;
                        }
                        case 403: {
                            BDFDB.NotificationUtils.toast("Invalid Api Key", {type: "danger", position: "center"});
                          return;
                        }
                        default: {
                            BDFDB.NotificationUtils.toast("Server or Api is Down", {type: "danger", position: "center"});
                          return;
                          
                        }
                      }
			})
        }
        
        getUUID() {
            const form = document.getElementById("searchInput")
            var username = form.value
            if (username.length >= 32) {
              form.value = ""
              uuid = username
              if (uuid) {this.getPlayer(uuid)}
            }
            if (!username || username.length > 16) return;
            form.value = ""
            BDFDB.LibraryRequires.request(`https://api.mojang.com/users/profiles/minecraft/${username}`, (err, res) => {
                if (res.statusCode !== 200) return BDFDB.NotificationUtils.toast(`${username} does not exist`, {type: "danger"});
                const data =  JSON.parse(res.body);
                uuid = data.id
                user = username
                if (uuid) {
                  this.getPlayer(uuid)
                }
        })
    }


        getPlayer(tuuid) {
            BDFDB.LibraryRequires.request(`https://api.hypixel.net/player?key=${apiKey}&uuid=${tuuid}`, (err, res) => {
              var body = JSON.parse(res.body)
              if (res.statusCode == 403) {
                BDFDB.NotificationUtils.toast("Invalid Api Key", {type: "danger"}); 
                document.getElementById("bodyResult").innerHTML = '';
              }
              else if (res.statusCode == 429 || res.statusCode == 401) {
                BDFDB.NotificationUtils.toast("Requesting Too Much", {type: "danger"});
              }
              else if (body.player == null) {
                BDFDB.NotificationUtils.toast("This user has not logged on to Hypixel", {type: "danger"});
                document.getElementById("bodyResult").innerHTML = '';
              }
                  else if (res.statusCode == 200) {
                  uuid = tuuid

                  document.getElementById("bodyResult").innerHTML = ''
                  this.statLoader()
                  const body = JSON.parse(res.body);
                  player = body?.player

                  rank = this.getRank(player)
                  plusColor = this.getPlusColor(rank, player.rankPlusColor)
                  formattedRank = this.getFormattedRank(rank, plusColor.mc)

                  const ign = `${formattedRank}${player.displayname}`
                  displayName = this.mcColorParser(ign)


                  if (player) this.getHyapi()
                }
                  else {
                    BDFDB.NotificationUtils.toast("Server or Api is Down", {type: "danger"});
                    document.getElementById("bodyResult").innerHTML = '';
                  }
            })
        }

        getHyapi() {
          BDFDB.LibraryRequires.request(`https://hyapi.tech/api/player?uuid=${uuid}&key=statsifystats&options=guild`, (err, res) => {
            var body = JSON.parse(res.body)
            if (res.statusCode == 200 || body.error === "Cannot read property 'toLowerCase' of undefined" || body.error === "Cannot convert undefined or null to object" || body.error === "Cannot read property 'find' of undefined") {

            const player = JSON.parse(res.body);
            hyApi = player

            if (body.error === "Cannot read property 'toLowerCase' of undefined" || body.error === "Cannot convert undefined or null to object" || body.error === "Cannot read property 'find' of undefined") {
              BDFDB.NotificationUtils.toast("An error occurred with HyApi some stats wont be displayed", {type: "danger"});
            }
            if (hyApi) this.getGuild()
            }

              else if (body.error === "Reached query limit per minute [20]") {
                BDFDB.NotificationUtils.toast("You are requesting too much!", {type: "danger"});
                document.getElementById("bodyResult").innerHTML = '';
              }
                else if (res.statusCode == 404) {
                  BDFDB.NotificationUtils.toast("An error occurred with HyApi, please report on github if not fixed", {type: "danger"});
                  document.getElementById("bodyResult").innerHTML = '';
                }
                  else {BDFDB.NotificationUtils.toast("HyApi is Down", {type: "danger"});
                  document.getElementById("bodyResult").innerHTML = '';
              }
        })
        }

        getGuild() {
            BDFDB.LibraryRequires.request(`https://api.hypixel.net/guild?key=${apiKey}&player=${uuid}`, (err, res) => {
                const guildBody = JSON.parse(res.body);
                guild = guildBody
                if (guild.guild == null) null;
                else {
                  const getGuildTagColor = color => ({ "DARK_AQUA": { hex: "#00AAAA", mc: "§3" }, "DARK_GREEN": { hex: "#00AA00", mc: "§2" }, "YELLOW": { hex: "#FFFF55", mc: "§e" }, "GOLD": { hex: "#FFAA00", mc: "§6" } }[color] || { hex: "#AAAAAA", mc: "§7" })

                  body_guild_mcColor = getGuildTagColor(guildBody.guild.tagColor);

                  if (gcache[uuid]?.id !== guild?.guild?._id){
                    BDFDB.DataUtils.remove(this, "guildcache")
                    this.forceUpdateAll();
                  }
                }
                 if (guild) this.getFriend()
            })
        }

        getFriend() {
          BDFDB.LibraryRequires.request(`https://api.hypixel.net/friends?key=${apiKey}&uuid=${uuid}`, (err, res) => {
            const friend = JSON.parse(res.body);

            friendCount = friend.records.length.toLocaleString()        
            if (friendCount) this.popoverUpdater();
          })
        }


        addButton() {
            const textbar = document.querySelector('form [class^=buttons-3JBrkn]');
            if (textbar) textbar.appendChild(buttonHTML);
            buttonHTML.onclick = () => {
              if (popsize.size === 0) {
                BDFDB.NotificationUtils.toast("Popover window size is set at 0%, nothing is going to be displayed", {type: "danger"});
              }
                buttonHTML.style.color = null;
                if (popover.style.display !== 'none') {
                    popover.style.display = 'none';
                    
                }
                
                 else {
                    popover.style.display = '';
                    buttonHTML.style.color = 'white';

                }
            }
            
        }
        

        statLoader() {
          let temp = document.getElementById("bodyResult")
          temp.innerHTML = `<div class="stat-loader content-center"><img class="stat-loading" src="https://cdn.discordapp.com/attachments/803669565120577556/870732561008164924/statsify.gif">
          </div>`
        }

        backArrow() {
            document.getElementById("bodyResult").innerHTML = '';
        }

        copyProfile() {
          var temp = document.createElement("input");
          temp.setAttribute("value", document.getElementById("profile-discord").innerHTML);
          document.body.appendChild(temp);
          temp.select();
          document.execCommand("copy");
          document.body.removeChild(temp);
      }

        observer(e) {
            if (!e.addedNodes.length || !e.addedNodes[0] || !e.addedNodes[0].querySelector) return;
            const textbar = e.addedNodes[0].querySelector('form [class^=buttons-3JBrkn]');
            if (textbar) this.addButton(textbar);
        }

        numberParse(string) {
          let number = string
          let regex = /\b([0-9])\b/gm
          let replace = `0$1`

          return number.toString().replace(regex, replace)
        }

        precentParse(string) {
          let number = string.toString()
          let regex = /.+\.|\./g
          let replace = ``

          return number.replace(regex, replace)
        }

        popoverSize() {
          if (popover) {
            if (popsize.size === 100){
            popover.style.transform = `scale(1)`
            }
            else {
              popover.style.transform = `scale(.${this.numberParse(popsize.size)})`
            }
          }
          else null
        }


        getRank = (player) => {
            let rank = 'NON';
            if ((player).monthlyPackageRank || (player).packageRank || (player).newPackageRank) {
              if ((player).monthlyPackageRank == "SUPERSTAR") rank = replaceRank((player).monthlyPackageRank);
              else {
                if ((player).packageRank && (player).newPackageRank) rank = replaceRank((player).newPackageRank);
                else rank = replaceRank((player).packageRank || (player).newPackageRank);
              }
            }
            if ((player).rank && (player).rank != 'NORMAL') rank = (player).rank.replace('MODERATOR', 'MOD');
            if ((player).prefix) rank = (player).prefix.replace(/§.|\[|]/g, '');
            if (rank == "YOUTUBER") rank = "YOUTUBE"
          
            function replaceRank(toReplace) {
              return toReplace
                .replace('SUPERSTAR', "MVP++")
                .replace('VIP_PLUS', 'VIP+')
                .replace('MVP_PLUS', 'MVP+')
                .replace('NONE', '');
            }
          
            return rank.length == 0 ? `NON` : rank;
          }


        getPlusColor = (rank, plus) => {
            if (plus == undefined || rank == 'PIG+++') {
              var rankColor = {
                'MVP+': { mc: '§c', hex: '#FF5555' },
                'MVP++': { mc: '§c', hex: '#FFAA00' },
                'VIP+': { mc: '§6', hex: '#FFAA00' },
                'PIG+++': { mc: '§b', hex: '#FF55FF' },
              }[rank]
              if (!rankColor) return { mc: '§7', hex: '#BAB6B6' }
            } else {
              var rankColorMC = {
                RED: { mc: '§c', hex: '#FF5555' },
                GOLD: { mc: '§6', hex: '#FFAA00' },
                GREEN: { mc: '§a', hex: '#55FF55' },
                YELLOW: { mc: '§e', hex: '#FFFF55' },
                LIGHT_PURPLE: { mc: '§d', hex: '#FF55FF' },
                WHITE: { mc: '§f', hex: '#F2F2F2' },
                BLUE: { mc: '§9', hex: '#5555FF' },
                DARK_BLUE: { mc: '§1', hex: '#0000AA' },
                DARK_GREEN: { mc: '§2', hex: '#00AA00' },
                DARK_RED: { mc: '§4', hex: '#AA0000' },
                DARK_AQUA: { mc: '§3', hex: '#00AAAA' },
                DARK_PURPLE: { mc: '§5', hex: '#AA00AA' },
                DARK_GRAY: { mc: '§8', hex: '#555555' },
                BLACK: { mc: '§0', hex: '#000000' },
              }[plus]
              if (!rankColorMC) return { mc: '§7', hex: '#BAB6B6' }
            }
            return rankColor || rankColorMC;
          }

          getFormattedRank = (rank, color) => {
            rank = { 'MVP+': `§b[MVP${color}+§b]`, 'MVP++': `§6[MVP${color}++§6]`, 'MVP': '§b[MVP]', 'VIP+': `§a[VIP${color}+§a]`, 'VIP': `§a[VIP]`, 'YOUTUBE': `§c[§fYOUTUBE§c]`, 'PIG+++': `§d[PIG${color}+++§d]`, 'HELPER': `§9[HELPER]`, 'MOD': `§2[MOD]`, 'ADMIN': `§c[ADMIN]`, 'OWNER': `§c[OWNER]`, 'SLOTH': `§c[SLOTH]`, 'ANGUS': `§c[ANGUS]`, 'APPLE': '§6[APPLE]', 'MOJANG': `§6[MOJANG]`, 'BUILD TEAM': `§3[BUILD TEAM]`, 'EVENTS': `§6[EVENTS]` }[rank]
            if (!rank) return `§7`
            return `${rank} `
          }

          getRankColor = (rank) => {
            if (["YOUTUBE", "ADMIN", "OWNER", "SLOTH"].includes(rank)) return "c";
            else if (rank == "PIG+++") return "d";
            else if (rank == "MOD") return "2";
            else if (rank == "HELPER") return "9";
            else if (rank == "BUILD TEAM") return "3";
            else if (["MVP++", "APPLE", "MOJANG"].includes(rank)) return "6";
            else if (["MVP+", "MVP"].includes(rank)) return "b";
            else if (["VIP+", "VIP"].includes(rank)) return "a";
            else return "7";
          }

        ratio = (n1 = 0, n2 = 0) => isFinite(n1 / n2) ? + (n1 / n2).toFixed(2) : isFinite(n2) ? 0 : Infinity

        mcColorParser = text => {
            var splitText = text.split("§").slice(1)
            var finalText = ""
          
            splitText.forEach(parts => finalText += `<span class="${colors[parts[0]]?.color == undefined ? `white` : colors[parts[0]].color} shadow">${parts.split("").slice(1).join("")}</span>`)
            return finalText
          }

          status() {
            let online = hyApi?.online;
            let status = document.getElementById("status");

            if (online == true) {
              status.src="https://statsify.net/img/assets/online.png";
              status.title=`${player.displayname} is online`;
            }
            else {
              status.src="https://statsify.net/img/assets/offline.png";
              status.title=`${player.displayname} is offline`;
            }      
          }

          getTempDisplayName = async (tempuuid) => {
            const response = await fetch(`https://api.hypixel.net/player?key=${apiKey}&uuid=${tempuuid}`);
            const data = await response.json();
            const body = await data?.player
            if (response.status == 200) {

              let values =  {guuid: `${tempuuid}`};

              var trank = this.getRank(body)
              var tplusColor = this.getPlusColor(trank, body.rankPlusColor)
              var tformattedRank = this.getFormattedRank(trank, tplusColor.mc)

              var lastLogout = body.lastLogout

              const rawign = `${tformattedRank}${body.displayname}`
              var tempDisplayName = this.mcColorParser(rawign)

              gcache[values.guuid] = {
                id: guild?.guild?._id,
                rawname: rawign,
                lastlogout: lastLogout
              }
              
                if (gcache[tempuuid] !== tempuuid) {
                  BDFDB.DataUtils.save(gcache, this, "guildcache");
                  this.forceUpdateAll();
              }

            return { tempDisplayName, lastLogout }
            }
            else if (response.status == 429) return `<span style="font-size: 10px"class="red shadow">*rate limit*</span>`
            else return ''
        }
            

          loadProfile() {
            const profile = `${player?.socialMedia ? `<div class="profiles">
            ${player?.socialMedia?.links?.YOUTUBE ? `<a style="cursor: default;" class="youtube"><img title="Open Link to Youtube!" class="profile" data-tooltip="Open Link" onclick="window.open('${player?.socialMedia?.links?.YOUTUBE}')"id="click-youtube" style="margin-right: 1em;" src="https://cdn.discordapp.com/emojis/737967209057353799.png?v=1"></a>` : ""}
            ${player?.socialMedia?.links?.TWITCH ? `<a style="cursor: default;" class="twitch"><img title="Open Link to Twitch!" class="profile" data-tooltip="Open Link" onclick="window.open('${player?.socialMedia?.links?.TWITCH}')"id="click-twitch" style="margin-right: 1em;" src="https://cdn.discordapp.com/emojis/737967209350955029.png?v=1"></a>` : ""}
            ${player?.socialMedia?.links?.TWITTER ? `<a style="cursor: default;" class="twitter"><img title="Open Link to Twitter!" class="profile" data-tooltip="Open Link" onclick="window.open('${player?.socialMedia?.links?.TWITTER}')"id="click-twitter" style="margin-right: 1em;" src="https://cdn.discordapp.com/emojis/737967209241903145.png?v=1"></a>` : ""}
            ${player?.socialMedia?.links?.INSTAGRAM ? `<a style="cursor: default;" class="instagram"><img title="Open Link to Instagram!" class="profile" data-tooltip="Open Link" onclick="window.open('${player?.socialMedia?.links?.INSTAGRAM}')"id="click-instagram" style="margin-right: 1em;" src="https://cdn.discordapp.com/emojis/737967209363669062.png?v=1"></a>` : ""}
            ${player?.socialMedia?.links?.HYPIXEL ? `<a style="cursor: default;" class="hypixel"><img title="Open Link to Hypixel!" class="profile" data-tooltip="Open Link" onclick="window.open('${player?.socialMedia?.links?.HYPIXEL}')"id="click-hypixel" style="margin-right: 1em;" src="https://cdn.discordapp.com/emojis/737967451622342666.png?v=1"></a>` : ""}
            ${player?.socialMedia?.links?.DISCORD ? `<a style="cursor: default;" class="discord"><img class="profile" title="Copy!" id="click-discord" src="https://media.discordapp.net/attachments/805054249552576524/862809743013052446/Discord_Logo_Circle.png?width=701&height=701"><p id="profile-discord"style="font-size: 0px;position:absolute;">${player?.socialMedia?.links?.DISCORD}</p></a>` : ""}
            </div>` : ""}`
            profiles = profile
          }

          loadGuildGames() {
            const ggames = `${guild?.guild?.preferredGames ? `<div>
            <div>
            <a class="content-center"><span style="color: white;margin-right: 1px;font-size: 20px;margin-bottom:5px;">Preferred Games</span></a>
            </div>
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "QUAKECRAFT" ) ? `<a style="cursor: default;"><img class="guild-games" title="QuakeCraft" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/Quakecraft-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "WALLS" ) ? `<a style="cursor: default;"><img class="guild-games" title="The Walls" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/Walls-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "PAINTBALL" ) ? `<a style="cursor: default;"><img class="guild-games" title="PaintBall" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/Paintball-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "SURVIVAL_GAMES" ) ? `<a style="cursor: default;"><img class="guild-games" title="Blitz" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/SG-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "TNTGAMES" ) ? `<a style="cursor: default;"><img class="guild-games" title="TNT Games" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/TNT-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "VAMPIREZ" ) ? `<a style="cursor: default;"><img class="guild-games" title="VampireZ" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/VampireZ-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "WALLS3" ) ? `<a style="cursor: default;"><img class="guild-games" title="Mega Walls" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/MegaWalls-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "ARCADE" ) ? `<a style="cursor: default;"><img class="guild-games" title="Arcade" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/Arcade-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "ARENA" ) ? `<a style="cursor: default;"><img class="guild-games" title="Arena Brawl" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/Arena-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "UHC" ) ? `<a style="cursor: default;"><img class="guild-games" title="UHC" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/UHC-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "MCGO" ) ? `<a style="cursor: default;"><img class="guild-games" title="Cops vs Crims" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/CVC-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "BATTLEGROUND" ) ? `<a style="cursor: default;"><img class="guild-games" title="Warlords" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/Warlords-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "SUPER_SMASH" ) ? `<a style="cursor: default;"><img class="guild-games" title="Smash Heroes" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/SmashHeroes-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "GINGERBREAD" ) ? `<a style="cursor: default;"><img class="guild-games" title="Turbo Kart Racers" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/TurboKartRacers-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "HOUSING" ) ? `<a style="cursor: default;"><img class="guild-games" title="Housing" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/Housing-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "SKYWARS" ) ? `<a style="cursor: default;"><img class="guild-games" title="Skywars" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "TRUE_COMBAT" ) ? `<a style="cursor: default;"><img class="guild-games" title="Crazy Walls" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/CrazyWalls-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "SPEED_UHC" ) ? `<a style="cursor: default;"><img class="guild-games" title="Speed UHC" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/SpeedUHC-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "SKYCLASH" ) ? `<a style="cursor: default;"><img class="guild-games" title="Skyclash" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/SkyClash-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "PROTOTYPE" ) ? `<a style="cursor: default;"><img class="guild-games" title="Prototype" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/Prototype-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "BEDWARS" ) ? `<a style="cursor: default;"><img class="guild-games" title="Bedwars" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "MURDER_MYSTERY" ) ? `<a style="cursor: default;"><img class="guild-games" title="Murder Mystery" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/MurderMystery-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "BUILD_BATTLE" ) ? `<a style="cursor: default;"><img class="guild-games" title="Build Battle" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/BuildBattle-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "DUELS" ) ? `<a style="cursor: default;"><img class="guild-games" title="Duels" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "PIT" ) ? `<a style="cursor: default;"><img class="guild-games" title="Pit" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/Pit-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "SKYBLOCK" ) ? `<a style="cursor: default;"><img class="guild-games" title="SkyBlock" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/SkyBlock-64.png"></a>` : ``}
            ${guild?.guild?.preferredGames.find((preferredGames) => preferredGames === "SMP" ) ? `<a style="cursor: default;"><img class="guild-games" title="SMP" style="margin-right: 5px; margin-top: 5px;" src="https://hypixel.net/styles/hypixel-v2/images/game-icons/SMP-128.png"></a>` : ``}
            </div>` : ``}`
            guildGames = ggames
          }

          todayDate() {
            var todayDate = new Date();
            var dd = String(todayDate.getDate()).padStart(2, '0');
            var mm = String(todayDate.getMonth() + 1).padStart(2, '0'); 
            var yyyy = todayDate.getFullYear();

            todayDate = yyyy + '-' + mm + '-' + dd;
            today = todayDate
          }

          getDailyGuildxp(guuid) {
            let ign = guuid || null
            let dguild = guild?.guild?.members

            for (var xp in dguild ) {
              if (dguild[xp]?.uuid === ign)
              break;
          }
          return dguild[xp]?.expHistory?.[today]?.toLocaleString()
          }

          getWeeklyGuildxp(guuid) {
            let ign = guuid || null
            let dguild = guild?.guild?.members
            let exp = 0

            for (var xp in dguild ) {
              if (dguild[xp]?.uuid === ign)
              break;
          }
          var rawexp = Object.values(dguild[xp]?.expHistory)
          rawexp.forEach(value => {exp += value})
            return exp.toLocaleString()
          }

          getGuildRank(guuid) {
          let ign = guuid || null
          let dguild = guild?.guild?.members

          for (var xp in dguild ) {
            if (dguild[xp]?.uuid === ign)
            break;
         }
         return dguild[xp]?.rank
          }

          getGuildJoined(guuid) {
            let ign = guuid || null
            let dguild = guild?.guild?.members
  
            for (var xp in dguild ) {
              if (dguild[xp]?.uuid === ign)
              break;
           }
           return new Date(dguild[xp]?.joined)?.toDateString()
          }



          loadGuildMembers = async () => {
            const ranks = Object.fromEntries(guild?.guild?.ranks.map(rank => [rank?.name.toLowerCase(), rank]));
            const members = guild?.guild?.members.sort((a, b) => {
              const aPriority = ranks[a.rank.toLowerCase()]?.priority
              const bPriority = ranks[b.rank.toLowerCase()]?.priority

              if (!aPriority && !bPriority) {return 7}
              return (bPriority ?? 7) - (aPriority ?? 7)})

            var gmtable = document.getElementById(`gmtbody`)
            let dguild = await members

            for (var table in dguild) {
              var cache = gcache[dguild[table]?.uuid]
              let id = guild?.guild?._id

              if (cache?.rawname != undefined || cache?.lastlogout != undefined) {
              let row = `<tr>
                <td style="font-family:Minecraftia;text-align: left;font-size: 12px;"><img style="margin-right:10px;border-radius:4px;box-shadow: -1px 1px 10px 0px #18191c;" src="https://crafatar.com/avatars/${dguild[table]?.uuid}?size=25&overlay=true">  ${`<span style="cursor:pointer;"title="Search This Player" id="${dguild[table]?.uuid}">${this.mcColorParser(cache?.rawname) ?? `<span style="font-size: 10px"class="red shadow">*rate limit*</span>`}</span>`}</td1>
                <td>${await this.getGuildRank(dguild[table]?.uuid) || ""}</td>
                <td>${settings.gexp === true ? await this.getWeeklyGuildxp(dguild[table]?.uuid) || "0" : await this.getDailyGuildxp(dguild[table]?.uuid) || "0"}</td>
                <td>${await this.getGuildJoined(dguild[table]?.uuid) || ""}</td>
                <td>${new Date(await cache?.lastlogout).toLocaleString() || "error"}</td>
              </tr>`
              gmtable.innerHTML += row
              } else {
                let temp = await this.getTempDisplayName(dguild[table]?.uuid)
                let row = `<tr>
                <td style="font-family:Minecraftia;text-align: left;font-size: 12px;"><img style="margin-right:10px;border-radius:4px;box-shadow: -1px 1px 10px 0px #18191c;" src="https://crafatar.com/avatars/${dguild[table]?.uuid}?size=25&overlay=true">  ${`<span id="${dguild[table]?.uuid}">${cache?.rawname != undefined ? this.mcColorParser(cache?.rawname) : await temp.tempDisplayName ?? `<span style="font-size: 10px"class="red shadow">*rate limit*</span>`}</span>`}</td1>
                <td>${await this.getGuildRank(dguild[table]?.uuid) || ""}</td>
                <td>${settings.gexp === true ? await this.getWeeklyGuildxp(dguild[table]?.uuid) || "0" : await this.getDailyGuildxp(dguild[table]?.uuid) || "0"}</td>
                <td>${await this.getGuildJoined(dguild[table]?.uuid) || ""}</td>
                <td>${cache?.rawname != undefined ? new Date(await cache?.lastlogout).toLocaleString() || "error" : new Date(await temp.lastLogout).toLocaleString()}</td>
              </tr>`
              gmtable.innerHTML += row
              }

            }
            for (let table in dguild) {
              var element = document.getElementById(`${dguild[table]?.uuid}`)
              element.addEventListener("click", () => this.getPlayer(dguild[table]?.uuid))
            }
          }
          
          loadGuildTab() {
            this.loadGuildGames()

            const guildcheck = `${guild?.guild ? `<div>
            <div>
            <a class=content-center> <h1 class="gtag">${this.mcColorParser(guild?.guild ? hyApi?.guild?.name ? ` ${body_guild_mcColor.mc}${hyApi.guild.name}${body_guild_mcColor.mc}` : "" : "")} ${gcolor}</h1> </a> 
            </div>
            <div>
            <div class="ggs-res">
            <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Level</span> <span class="dark_green dark_green.shadow" style="font-size: 18px;font-weight: bold;"><br>${(hyApi?.guild?.level || 0).toLocaleString()}</span></a>
            <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Daily GEXP</span> <span class="dark_green dark_green.shadow" style="font-size: 18px;font-weight: bold;"><br>${this.getDailyGuildxp(uuid) || 0}</span></a>
            <a class=""><span style="color: white;margin-right: 1px;font-size: 20px;">Members</span> <span class="dark_green dark_green.shadow" style="font-size: 18px;font-weight: bold;"><br>${(guild?.guild?.members?.length || 0).toLocaleString()}<br></span></a>
            </div>
            </div>
            <div>
            <div class="ggs-res">
            <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Creation</span> <span class="dark_green dark_green.shadow" style="font-size: 18px;font-weight: bold;"><br>${(new Date(guild?.guild?.created) || 0).toLocaleString()}</span></a>
            <a class="gs-a" style="overflow-wrap: anywhere;"><span style="color: white;margin-right: 1px;font-size: 20px;">Description</span> <span class="dark_green dark_green.shadow" style="font-size: 18px;font-weight: bold;-webkit-user-select:text;cursor:text;"><br>${(guild?.guild?.description || "Nothing Set").toLocaleString()}</span></a>
            <a class=""><span style="color: white;margin-right: 1px;font-size: 20px;">Publicly Listed</span> <span class="dark_green dark_green.shadow" style="font-size: 18px;font-weight: bold;"><br>${(guild?.guild?.publiclyListed ? "Yes" : "No" || "No").toLocaleString()}<br></span></a>
            </div>
            </div>
            <div style="display: grid;margin-bottom: 20px;text-align: center;">
            ${guildGames}
            </div>
            <div class="tab" style="margin-top: 1em;max-width:828px">
            <input class="input56" type="checkbox" id="chck50">
            <label class="tab-label" for="chck50">Guild Members</label>
            <div class="tab-content" style="background-color: #36393f;">
            ${settings.guildmember === true ? `<table class="gmtable" id="gmtable">
              <tr>
                  <th>Username</th>
                  <th>Rank</th>
                  <th>${settings.gexp === true ? "Weekly GEXP" : "Daily GEXP"}</th>
                  <th>Joined</th>
                  <th>Last Login</th>
              </tr>
              <tbody id="gmtbody">
              </tbody>
            </table>` : `<div class="content-center"><a><span style="font-weight: bold;font-size: 20px;color: #FF5555;">you have this option disabled, go to plugin settings to toggle it</span></a></div>`}
            </div>
            </div>
            </div>` : `<div class="content-center"><a><span style="font-family:Minecraftia;font-size: 20px;color: #FF5555;">${displayName} is not in a guild</span></a></div>`}`
            guildtab = guildcheck
          }

          convertPetName(name){
            let converted = name.toLowerCase()
            converted = converted.split(/_/)
            if(converted.includes("baby")) converted.unshift(converted.pop())
            converted = converted.map(word => word.charAt(0).toUpperCase() + word.slice(1))
            converted = converted.join(" ")
            return converted
          }

          totemLoader() {
            var tsize = player?.achievementTotem?.allowed_max_height || 1
            for (var i = 0; i < tsize; i++) {
                var element = document.querySelector(`[id=totem] li:not(.active)`);
                if (element){    
                  element.classList.add("active");
                }
                  else null;   
            }
          }

          convertPetLevel(exp) {
            let pexp = exp || 0
            
            for (var level in pet) {
              if (pexp < pet[level]){
                break;
              }
            }
            return level-1
          }

          ptableLoader() {
            var ptable = document.getElementById(`ptbody`)
            const pdata = player?.petStats
            for (var table in pdata) {
              var row = `<tr>
                <td>${this.convertPetName(table)}</td>
                <td>${pdata[table]?.name?.includes(`§`) ? this.mcColorParser(pdata[table]?.name || "Unset Name") : pdata[table]?.name || "Unset Name"}</td>
                <td>${this.convertPetLevel(pdata[table]?.experience)}</td>
              </tr>`
              ptable.innerHTML += row
            }
          }



          petStats() {
            const pexp = player?.petStats?.[player?.currentPet]?.experience || 0

            for (var level in pet) {
              if (pexp < pet[level]){
                break;
              }
            }
            petLevel = level-1

            petLoad = `${player?.currentPet ? `<div>
            <div class="content-center" style="margin-bottom:1em;">
            <a><span style="color: #a8f0d8;margin-right: 1px;font-size: 20px;">${this.convertPetName(player?.currentPet)} Pet</span></a>
            </div>
            <div class="content-center" style="margin-bottom:.5em;">
              <span style="color: white;margin-right: 1px;font-size: 20px;">${player?.petStats?.[player?.currentPet]?.name?.includes(`§`) ? this.mcColorParser(player?.petStats?.[player?.currentPet]?.name) : player?.petStats?.[player?.currentPet]?.name || ""}</span>
            </div>
            <div class="plevel-progress" data-label="Level ${petLevel}">
              <span class="pvalue" style="max-width:100%; width:${petLevel === 1 ? 0 : petLevel}%;"></span>
            </div>
            </div>` : ''}`

            totemLoad = `${player?.achievementTotem?.allowed_max_height ? `<div>
            <div class="content-center" style="margin-bottom:1em;">
            <a><span style="color: #a8f0d8;margin-right: 1px;font-size: 20px;">Totem</span></a>
            </div>
            <div class="content-center" style="margin-bottom:1em;">
            <a><span style="color: white;margin-right: 1px;font-size: 20px;">${player?.petStats?.TOTEM?.name?.includes(`§`) ? this.mcColorParser(player?.petStats?.TOTEM?.name) : player?.petStats?.TOTEM?.name || "Unset Name"}</span></a>
            </div>
            <div>
            <ul id="totem" class="totembar totem">
              <li class="" title="totem size">1</li>
              <li class="" title="totem size">2</li>
              <li class="" title="totem size">3</li>
              <li class="" title="totem size">4</li>
              <li class="" title="totem size">5</li>
           </ul>
          </div>
            </div>` : `<div style="margin-bottom:1em;" class="content-center"><a><span style="font-family:Minecraftia;font-size: 15px;color: #FF5555;">${displayName} does not have a totem</span></a></div>`}`

            ptableLoad = `${player?.petStats ? `<div>
            <div class="tab" style="margin-top: 1em;">
            <input class="input56" type="checkbox" id="chck51">
            <label class="tab-label" for="chck51">Pet's List</label>
            <div class="tab-content" style="background-color: #36393f;">
            <table class="ptable" id="ptable">
              <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Level</th>
              </tr>
              <tbody id="ptbody">
              </tbody>
            </table>
            </div>
            </div>
            </div>` : `<div class="content-center"><a><span style="font-family:Minecraftia;font-size: 15px;color: #FF5555;">${displayName} does not have any pets</span></a></div>`}`
          }

          showZomTable() {
              let t = document.getElementById("ztable");
            if (t) {
              if (t.style.display === "none") {
                t.style.display = "";
              } else {
                t.style.display = "none";
              }
            }
          }



        popoverUpdater() {    
              let tempbres = document.getElementById("bodyResult")
  
              var networkLevel = ((Math.sqrt(player.networkExp || 0 + 15312.5) - 125/Math.sqrt(2))/(25*Math.sqrt(2))).toFixed(0);

              var rawgcolor = `${guild.guild ? guild.guild.tag ? ` ${body_guild_mcColor.mc}[${guild.guild.tag}${body_guild_mcColor.mc}]` : "" : ""}`
              gcolor = this.mcColorParser(rawgcolor)

              
              this.loadProfile()
              this.loadGuildTab()
              this.petStats()
              this.todayDate()

              tempbres.innerHTML = `<div>
                
              <a class=top-section-name> <img class="skull" src="https://crafatar.com/avatars/${uuid}?size=60&overlay=true"> <h1 class="displaynametext">${displayName} ${gcolor}</h1> </a> 

              <div class="row">
                <div class="col">
                  <div>
                    <div class="tab" style="width: 860px;">
                      <img id="status" class="status" title="" src="">
                      <input class="input56" type="checkbox" id="chck1">
                      <label class="tab-label" for="chck1">General Stats</label>
                      <div class="tab-content">
                      <div class="">
                      <div class="gs-res">
                      <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Level</span> <span style="font-size: 18px;font-weight: bold;color: #FFAA00;"><br>${networkLevel || 0}</span></a>
                      <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Quests</span> <span style="font-size: 18px;font-weight: bold;color: #71e11c;"><br>${(hyApi?.quests || 0).toLocaleString()}</span></a>
                      <a class=""><span style="font-size: 20px;color: white;">Karma</span> <span style="font-size: 18px;font-weight: bold;color: #ff55ffd9;"><br>${(player?.karma || 0).toLocaleString()}</span></a>
                      </div>
                      </div>
                      <div class="">
                      <div class="gs-res">
                      <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Ap</span> <span style="font-size: 18px;font-weight: bold;color: #FFAA00;"><br>${(player?.achievementPoints || 0).toLocaleString()}</span></a>
                      <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Challenges</span> <span style="font-size: 18px;font-weight: bold;color: #71e11c;"><br>${(hyApi?.challenges || 0).toLocaleString()}</span></a>
                      <a class=""><span style="font-size: 20px;color: white;">Friends</span> <span style="font-size: 18px;font-weight: bold;color: #ff55ffd9;"><br>${(friendCount || 0).toLocaleString()}</span></a>
                      </div>
                      </div>
                      <div class="">
                      <div class="gs-res">
                      <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">First Login</span> <span style="font-size: 18px;font-weight: bold;color: #FFAA00;"><br>${(new Date(player?.firstLogin) || 0).toLocaleString()}</span></a>
                      <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Last Login</span> <span style="font-size: 18px;font-weight: bold;color: #71e11c;"><br>${(new Date(hyApi?.lastLogin) || 0).toLocaleString()}</span></a>
                      <a class=""><span style="font-size: 20px;color: white;">Last Logout</span> <span style="font-size: 18px;font-weight: bold;color: #ff55ffd9;"><br>${(new Date(hyApi?.lastLogout) || 0).toLocaleString()}</span></a>
                      </div>
                      </div>
                      <div class="">
                      <div class="gs-res">
                      <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Gifts Given</span> <span style="font-size: 18px;font-weight: bold;color: #AA00AA;"><br>${(hyApi?.gifted?.giftsGiven || 0).toLocaleString()}</span></a>
                      <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Gifts Received</span> <span style="font-size: 18px;font-weight: bold;color: #AA00AA;"><br>${(hyApi?.gifted?.giftsReceived || 0).toLocaleString()}</span></a>
                      <a class=""><span style="color: white;margin-right: 1px;font-size: 20px;">Ranks Gifted</span> <span style="font-size: 18px;font-weight: bold;color: #AA00AA;"><br>${(hyApi?.gifted?.ranksGiven || 0).toLocaleString()}</span></a>
                      </div>
                      </div>
                      <div>
                      ${profiles}
                      </div>
                      <div class="lvl-gs content-center">
                      <img src="https://gen.plancke.io/exp/${uuid}.png">
                      </div>
                      <div class="ap-gs content-center">
                      <img src="https://gen.plancke.io/achievementPoints/${uuid}.png">
                      </div>
                      </div>
                    </div>
                    <div class="tab">
                      <input class="input56" type="checkbox" id="chck2">
                      <label class="tab-label" for="chck2">Guild Stats</label>
                      <div class="tab-content">
                      ${guildtab}
                      </div>
                    </div>
                  <div class="tab">
                    <input class="input56" type="checkbox" id="chck3">
                    <label class="tab-label" for="chck3">Pet Stats</label>
                    <div class="tab-content">
                      ${petLoad}
                      ${totemLoad}
                      ${ptableLoad}
                    </div>
                  </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck4">
                  <label class="tab-label" for="chck4">Arcade</label>
                  <div class="tab-content">
                  <div><a class="content-center"> <h1 class="gold shadow arcade_top">Coins<span style="margin-left:2px;font-size: 20px;" class="arcade_top white shadow">:</span><span style="margin-left:5px;font-size: 20px;"class="arcade_top shadow white">${(player?.stats?.Arcade?.coins || 0).toLocaleString()}</span></h1> </a></div>
                  <div class="arcade_table">
                  <div class="arcade_package">
                    <div><h1 class="arcade_header">Galaxy Wars</h1></div>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Kills</span><span class="arcade_stat"><br>${(player?.stats?.Arcade?.sw_kills || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Rebel Kills</span><span class="arcade_stat"><br>${(player?.stats?.Arcade?.sw_rebel_kills || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Deaths</span><span class="arcade_stat"><br>${(player?.stats?.Arcade?.sw_deaths || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Empire Kills</span><span class="arcade_stat"><br>${(player?.stats?.Arcade?.sw_empire_kills || 0).toLocaleString()}</span></a></div>
                    </div>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">KDR</span><span class="arcade_stat"><br>${this.ratio(player?.stats?.Arcade?.sw_kills || 0, player?.stats?.Arcade?.sw_deaths || 0)}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Weekly Kills</span><span class="arcade_stat"><br>${(player?.stats?.Arcade?.sw_weekly_kills_b || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Shots Fired</span><span class="arcade_stat"><br>${(player?.stats?.Arcade?.sw_shots_fired || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Monthly Kills</span><span class="arcade_stat"><br>${(player?.stats?.Arcade?.sw_monthly_kills_b || 0).toLocaleString()}</span></a></div>
                    </div>
                  </div>
                  <div class="arcade_package">
                    <h1 class="arcade_header">Farm Hunt</h1>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Wins</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wins_farm_hunt || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Poop Collected</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.poop_collected || 0).toLocaleString()}</span></a></div>
                    </div>
                  </div>
                  <div class="arcade_package">
                    <h1 class="arcade_header">Grinch Simulator</h1>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Wins</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wins_grinch_simulator_v2 || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Gifts</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.gifts_grinch_simulator_v2 || 0).toLocaleString()}</span></a></div>
                    </div>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Tourney Wins</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wins_grinch_simulator_v2_tourney || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Tourney Loses</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.losses_grinch_simulator_v2_tourney || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Tourney WLR</span><br><span class="arcade_stat">${this.ratio(player?.stats?.Arcade?.wins_grinch_simulator_v2_tourney || 0, player?.stats?.Arcade?.losses_grinch_simulator_v2_tourney || 0)}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Tourney Gifts</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.gifts_grinch_simulator_v2_tourney || 0).toLocaleString()}</span></a></div>
                    </div>
                    </div>
                  <div class="arcade_package">
                    <h1 class="arcade_header">Bounty Hunters</h1>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Kills</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.kills_oneinthequiver || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Bounty Kills</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.bounty_kills_oneinthequiver || 0).toLocaleString()}</span></a></div>
                    </div>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">KDR</span><br><span class="arcade_stat">${this.ratio(player?.stats?.Arcade?.kills_oneinthequiver || 0, player?.stats?.Arcade?.deaths_oneinthequiver || 0)}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Bounty KDR</span><br><span class="arcade_stat">${this.ratio(player?.stats?.Arcade?.bounty_kills_oneinthequiver || 0, player?.stats?.Arcade?.deaths_oneinthequiver || 0)}</span></a></div>
                    </div>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Wins</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.deaths_oneinthequiver || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Deaths</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wins_oneinthequiver || 0).toLocaleString()}</span></a></div>
                    </div>
                  </div>
                  </div>
                  <div class="arcade_table">
                  <div class="arcade_package">
                    <h1 class="arcade_header">Blocking Dead</h1>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Wins</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wins_dayone || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Kills</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.kills_dayone || 0).toLocaleString()}</span></a></div>
                    </div>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">HeadShots</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.headshots_dayone || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Melee Weapon</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.melee_weapon || "").toLocaleString().toLowerCase()}</span></a></div>
                    </div>
                  </div>
                  <div class="arcade_package">
                    <h1 class="arcade_header">Soccer</h1>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Wins</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wins_soccer || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Goals</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.goals_soccer || 0).toLocaleString()}</span></a></div>
                    </div>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Kicks</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.kicks_soccer || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Power Kicks</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.powerkicks_soccer || 0).toLocaleString()}</span></a></div>
                    </div>
                  </div>
                </div>
                <div class="arcade_table">
                  <div class="arcade_package">
                    <h1 class="arcade_header">Mini Walls</h1>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Wins</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wins_mini_walls || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Selected Kit</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.miniwalls_activeKit || "solider").toLocaleString()}</span></a></div>
                    </div>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Kills</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.kills_mini_walls || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Final Kills</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.final_kills_mini_walls || 0).toLocaleString()}</span></a></div>
                    </div>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">KDR</span><br><span class="arcade_stat">${this.ratio(player?.stats?.Arcade?.kills_mini_walls || 0, player?.stats?.Arcade?.deaths_mini_walls || 0)}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">FKDR</span><br><span class="arcade_stat">${this.ratio(player?.stats?.Arcade?.final_kills_mini_walls || 0, player?.stats?.Arcade?.deaths_mini_walls || 0)}</span></a></div>
                    </div>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Wither Kills</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wither_kills_mini_walls || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Wither Damage</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wither_damage_mini_walls || 0).toLocaleString()}</span></a></div>
                    </div>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Deaths</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.deaths_mini_walls || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Arrows Shot</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.arrows_shot_mini_walls || 0).toLocaleString()}</span></a></div>
                    </div>
                  </div>
                  <div class="arcade_package">
                    <h1 class="arcade_header">Hole in the Wall</h1>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Wins</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wins_hole_in_the_wall || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Rounds</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.rounds_hole_in_the_wall || 0).toLocaleString()}</span></a></div>
                    </div>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Loses</span><br><span class="arcade_stat">${((player?.stats?.Arcade?.rounds_hole_in_the_wall || 0) - (player?.stats?.Arcade?.wins_hole_in_the_wall || 0)).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">WLR</span><br><span class="arcade_stat">${this.ratio(player?.stats?.Arcade?.wins_hole_in_the_wall || 0, player?.stats?.Arcade?.rounds_hole_in_the_wall || 0)}</span></a></div>
                    </div>
                  </div>
                  <div class="arcade_package">
                    <h1 class="arcade_header">Hypixel Says</h1>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Wins</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wins_simon_says || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Rounds</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.rounds_simon_says || 0).toLocaleString()}</span></a></div>
                    </div>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Loses</span><br><span class="arcade_stat">${((player?.stats?.Arcade?.rounds_simon_says || 0) - (player?.stats?.Arcade?.wins_simon_says || 0)).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">WLR</span><br><span class="arcade_stat">${this.ratio(player?.stats?.Arcade?.wins_simon_says || 0, player?.stats?.Arcade?.rounds_simon_says || 0 - player?.stats?.Arcade?.wins_simon_says || 0)}</span></a></div>
                    </div>
                  </div>
                  <div class="arcade_package">
                    <h1 class="arcade_header">Throwout</h1>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Wins</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wins_throw_out || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Kills</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.kills_throw_out || 0).toLocaleString()}</span></a></div>
                    </div>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Deaths</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.deaths_throw_out || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">KDR</span><br><span class="arcade_stat">${this.ratio(player?.stats?.Arcade?.kills_throw_out || 0, player?.stats?.Arcade?.deaths_throw_out || 0)}</span></a></div>
                    </div>
                  </div>
                </div>
                <div class="arcade_table">
                  <div class="arcade_package">
                    <h1 class="arcade_header">Dragon Wars</h1>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Wins</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wins_dragonwars2 || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Kills</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.kills_dragonwars2 || 0).toLocaleString()}</span></a></div>
                    </div>
                </div>
                    <div class="arcade_package">
                    <h1 class="arcade_header">Creeper Attack</h1>
                    <div class="as_middle">
                    <div class="arcade_div"><a><span class="arcade_text">Kills</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.max_wave || 0).toLocaleString()}</span></a></div>
                    </div>
                </div>
                </div>
                  <div class="arcade_table">
                  <div class="arcade_package">
                    <h1 class="arcade_header">Party Games</h1>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Wins</span><br><span class="arcade_stat">${((player?.stats?.Arcade?.wins_party || 0) + (player?.stats?.Arcade?.wins_party_2 || 0) + (player?.stats?.Arcade?.wins_party_3 || 0)).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Party Wins 1</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wins_party || 0).toLocaleString()}</span></a></div>
                    </div>
                    <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Party Wins 2</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wins_party_2 || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Party Wins 3</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wins_party_3 || 0).toLocaleString()}</span></a></div>
                    </div>
                </div>
                  <div class="arcade_package">
                    <h1 class="arcade_header">Ender Spleef</h1>
                    <div class="as_middle">
                    <div class="arcade_div"><a><span class="arcade_text">Wins</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wins_ender || 0).toLocaleString()}</span></a></div>
                    </div>
                  </div>
                </div>
                <div class="arcade_table">
                <div class="arcade_package">
                  <h1 class="arcade_header">Zombies</h1>
                  <button id="zombies_table" title="Display Zombies Stats Table" class="zombie-table">&#10066;</button>
                  <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Wins</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.wins_zombies || 0).toLocaleString()}</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Best Round</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.best_round_zombies || 0).toLocaleString()}</span></a></div>
                  </div>
                  <div class="as_div">
                  <div class="arcade_div"><a><span class="arcade_text">Kills</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.zombie_kills_zombies || 0).toLocaleString()}</span></a></div>
                  <div class="arcade_div"><a><span class="arcade_text">Deaths</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.deaths_zombies || 0).toLocaleString()}</span></a></div>
                  </div>
                  <div class="as_div">
                  <div class="arcade_div"><a><span class="arcade_text">KDR</span><br><span class="arcade_stat">${this.ratio(player?.stats?.Arcade?.zombie_kills_zombies || 0, player?.stats?.Arcade?.deaths_zombies || 0)}</span></a></div>
                  <div class="arcade_div"><a><span class="arcade_text">Doors Opened</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.doors_opened_zombies || 0).toLocaleString()}</span></a></div>
                  </div>
                  <div class="as_div">
                  <div class="arcade_div"><a><span class="arcade_text">Rounds Survived</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.total_rounds_survived_zombies || 0).toLocaleString()}</span></a></div>
                  <div class="arcade_div"><a><span class="arcade_text">Head Shots</span><br><span class="arcade_stat">${(player?.stats?.Arcade?.headshots_zombies || 0).toLocaleString()}</span></a></div>
                  </div>
                  <div class="as_div">
                    <div class="arcade_div"><a><span class="arcade_text">Accuracy</span><br><span class="arcade_stat">${this.precentParse(this.ratio(player?.stats?.Arcade?.bullets_hit_zombies || 0, player?.stats?.Arcade?.bullets_shot_zombies || 0))}%</span></a></div>
                    <div class="arcade_div"><a><span class="arcade_text">Head Shot Accuracy</span><br><span class="arcade_stat">${this.precentParse(this.ratio(player?.stats?.Arcade?.headshots_zombies || 0, player?.stats?.Arcade?.bullets_hit_zombies || 0))}%</span></a></div>
                  </div>
                  </div>
              </div>
              <div id="ztable" style="display:none;">
              <table class="zomtable" id="zomtable">
              <tr>
                  <th>Map</th>
                  <th>Downs</th>
                  <th>Revives</th>
                  <th>Doors Opened</th>
                  <th>Windows Repaired</th>
                  <th>Zombies Killed</th>
                  <th>Deaths</th>
                  <th>Best Round</th>
              </tr>
              <tbody>
                <tr>
                <td>Alien Arcadium</td>
                <td>${(player?.stats?.Arcade?.times_knocked_down_zombies_alienarcadium || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.players_revived_zombies_alienarcadium || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.doors_opened_zombies_alienarcadium || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.windows_repaired_zombies_alienarcadium || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.zombie_kills_zombies_alienarcadium || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.deaths_zombies_alienarcadium || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.best_round_zombies_alienarcadium || 0).toLocaleString()}</td>
                </tr>
                <tr>
                <td>Bad Blood</td>
                <td>${(player?.stats?.Arcade?.times_knocked_down_zombies_badblood || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.players_revived_zombies_badblood || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.doors_opened_zombies_badblood || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.windows_repaired_zombies_badblood || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.zombie_kills_zombies_badblood || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.deaths_zombies_badblood || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.best_round_zombies_badblood || 0).toLocaleString()}</td>
                </tr>
                <tr>
                <td>Dead End</td>
                <td>${(player?.stats?.Arcade?.times_knocked_down_zombies_deadend || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.players_revived_zombies_deadend || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.doors_opened_zombies_deadend || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.windows_repaired_zombies_deadend || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.zombie_kills_zombies_deadend || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.deaths_zombies_deadend || 0).toLocaleString()}</td>
                <td>${(player?.stats?.Arcade?.best_round_zombies_deadend || 0).toLocaleString()}</td>
                </tr>
              </tbody>
              </table>
              <table class="zomtable" id="zomtable">
              <tr>
                  <th>Type</th>
                  <th>Kills</th>
              </tr>
              <tbody>
                <tr>
                    <td>Basic</td>
                    <td>${(player?.stats?.Arcade?.basic_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Blaze</td>
                    <td>${(player?.stats?.Arcade?.blaze_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Blob</td>
                    <td>${(player?.stats?.Arcade?.blob_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Clown</td>
                    <td>${(player?.stats?.Arcade?.clown_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Empowered</td>
                    <td>${(player?.stats?.Arcade?.empowered_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Ender</td>
                    <td>${(player?.stats?.Arcade?.ender_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Ender Mite</td>
                    <td>${(player?.stats?.Arcade?.endermite_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Fire</td>
                    <td>${(player?.stats?.Arcade?.fire_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Guardian</td>
                    <td>${(player?.stats?.Arcade?.guardian_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Magma</td>
                    <td>${(player?.stats?.Arcade?.magma_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Magma Cube</td>
                    <td>${(player?.stats?.Arcade?.magma_cube_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Pig Zombie</td>
                    <td>${(player?.stats?.Arcade?.pig_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Rainbow</td>
                  <td>${(player?.stats?.Arcade?.rainbow_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Sentinel</td>
                    <td>${(player?.stats?.Arcade?.sentinel_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Skelefish</td>
                    <td>${(player?.stats?.Arcade?.skelefish_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Skeleton</td>
                    <td>${(player?.stats?.Arcade?.skeleton_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Slime</td>
                    <td>${(player?.stats?.Arcade?.slime_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Slime Zombie</td>
                    <td>${(player?.stats?.Arcade?.slime_zombie_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Space Blaster</td>
                    <td>${(player?.stats?.Arcade?.space_blaster_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Space Grunt</td>
                    <td>${(player?.stats?.Arcade?.space_grunt_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>TNT Baby</td>
                    <td>${(player?.stats?.Arcade?.tnt_baby_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Witch</td>
                    <td>${(player?.stats?.Arcade?.witch_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Wither Skeleton</td>
                    <td>${(player?.stats?.Arcade?.wither_skeleton_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Wither Zombie</td>
                    <td>${(player?.stats?.Arcade?.wither_zombie_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Wolf</td>
                    <td>${(player?.stats?.Arcade?.wolf_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Worm</td>
                    <td>${(player?.stats?.Arcade?.worm_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Worm Small</td>
                    <td>${(player?.stats?.Arcade?.worm_small_zombie_kills_zombies || 0).toLocaleString()}</td>
                </tr>
              </tbody>
              </table>
              </div>
              </div>
                    </div>
                  </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck5">
                  <label class="tab-label" for="chck5">BedWars</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck6">
                  <label class="tab-label" for="chck6">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
               <div class="tab">
                  <input class="input56" type="checkbox" id="chck7">
                  <label class="tab-label" for="chck7">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
               <div class="tab">
                  <input class="input56" type="checkbox" id="chck8">
                  <label class="tab-label" for="chck8">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck9">
                  <label class="tab-label" for="chck9">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
                 <div class="tab">
                  <input class="input56" type="checkbox" id="chck10">
                  <label class="tab-label" for="chck10">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck11">
                  <label class="tab-label" for="chck11">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
               <div class="tab">
                  <input class="input56" type="checkbox" id="chck12">
                  <label class="tab-label" for="chck12">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck13">
                  <label class="tab-label" for="chck13">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
               <div class="tab">
                  <input class="input56" type="checkbox" id="chck14">
                  <label class="tab-label" for="chck14">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck15">
                  <label class="tab-label" for="chck15">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck16">
                  <label class="tab-label" for="chck16">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck17">
                  <label class="tab-label" for="chck17">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
                  </div>
                </div>
              </div>
              <div class="row">
              <div class="col">
                <div>
              <div class="tab">
                <input class="input56" type="checkbox" id="chck18">
                <label class="tab-label" for="chck18">Item 3</label>
                <div class="tab-content">
                  text
                </div>
              </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck19">
                  <label class="tab-label" for="chck19">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck20">
                  <label class="tab-label" for="chck20">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck21">
                  <label class="tab-label" for="chck21">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck22">
                  <label class="tab-label" for="chck22">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck23">
                  <label class="tab-label" for="chck23">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
              </div>
              </div>
              </div>
              </div>`
              this.status()
              this.totemLoader()
              this.ptableLoader()
              
              document.getElementById("zombies_table").addEventListener("click", this.showZomTable);

              if (document.getElementById('gmtbody')) {this.loadGuildMembers()}
              if (hyApi?.social?.discord) document.getElementById("click-discord").addEventListener("click", this.copyProfile);
        }


            };
        })(window.BDFDB_Global.PluginUtils.buildPlugin(config));
 })();
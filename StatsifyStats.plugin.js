/**
 * @name StatsifyStats
 * @author Toxicial
 * @version 1.1.3
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
			"version": "1.1.3",
			"description": "Adds a Hypixel stats search within discord in the chat toolbar."
		},
		"rawUrl": `https://raw.githubusercontent.com/toxicial/StatsifyStats/main/StatsifyStats.plugin.js`,
		"changeLog": {
      "progress": {
        "working": "i am pretty much done with this project, ill be adding more updates maybe sometime in the later time, but atm currently will be working on other things so expect less updates, if bug's appear report on github and ill fix it asap. thank you! :)"
      },
      "added": {
        "games": "Finished All Games",
      },
      "fixed": {
        "ranked sw": "fixed the problem with ranked sw past ratings"
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
            let lb;
            let rr;
            


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
                  .arcade_package {border-radius: 15px;background: #36393f;box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);overflow: hidden;position: relative;color: #dcddde;height: 220px;display:grid;justify-content:center;text-align:center;padding-bottom:10px;background-size: cover;background-repeat: no-repeat;background-position: center;}
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
                  .bw-button-top{padding-right: 20px;padding-left: 20px;padding-bottom: 10px;padding-top: 10px;;margin-right:6px;background-color: var(--brand-experiment);font-size: 16px;font-weight: 500;;color: white;font-family: var( --font-primary);border-radius:5px;}
                  .bw-button-top:hover{background-color: var(--brand-experiment-560)}
                  .bw-button-top:active{background-color: var(--brand-experiment-600)}
                  .bw-display{position: absolute;}
                  .bwimgtt{position: absolute;white-space: nowrap;}
                  .bwbar {height: 10px;width: 10px;background-color: #AAAAAA;box-shadow: 5px 4px 0px #2A2A2A;display: inline-flex;margin-right: 1px;}
                  .bwbar.bwbaractive {background-color: #55FFFF;box-shadow: 5px 4px 0px #153F3F;}
                  .bwimgbottom{display: grid;grid-template-columns: 200px 200px;grid-gap: 300px;position: absolute;margin-top: 443px;text-align: center;}
                  .nowrap{white-space:nowrap;}
                  .bwimgstats{display: grid;grid-template-columns: 200px 200px 200px;position: absolute;text-align: center;white-space:nowrap;grid-gap: 50px;}
                  .bbimgstats{display: grid;grid-template-columns: 200px 200px 200px;position: absolute;text-align: center;white-space:nowrap;grid-gap: 30px;}
                  .bsgimgstats3{display: grid;grid-template-columns: 200px 200px 200px;position: absolute;text-align: center;white-space:nowrap;grid-gap: 25px;}
                  .bsgimgstats2{display: grid;grid-template-columns: 200px 200px;position: absolute;text-align: center;white-space:nowrap;grid-gap: 155px;}
                  .bsg-button-top{background-color: transparent;font-size: 18px;color: white;position:absolute;margin-left: 820px;margin-top:10px}
                  .bsg-display{position:absolute;}
                  #kits_body div {justify-content: center;display: inline-block;text-align: center;margin-right:25px;margin-bottom:20px;}
                  #kits_body div span {display: block;}
                  #kits_body {text-align: center;margin-top:45px;}
                  .bold {font-weight:bold;}
                  .cvc-button-top{padding-right: 20px;padding-left: 20px;padding-bottom: 10px;padding-top: 10px;;margin-right:6px;background-color: var(--brand-experiment);font-size: 16px;font-weight: 500;;color: white;font-family: var( --font-primary);border-radius:5px;}
                  .cvc-button-top:hover{background-color: var(--brand-experiment-560)}
                  .cvc-button-top:active{background-color: var(--brand-experiment-600)}
                  .cvc-display{}
                  .duels-button-top{padding-right: 20px;padding-left: 20px;padding-bottom: 10px;padding-top: 10px;;margin-right:6px;background-color: var(--brand-experiment);font-size: 16px;font-weight: 500;;color: white;font-family: var( --font-primary);border-radius:5px;}
                  .duels-button-top:hover{background-color: var(--brand-experiment-560)}
                  .duels-button-top:active{background-color: var(--brand-experiment-600)}
                  .duels-header{font-family:Minecraftia;text-shadow:1px 1px black;color:#2c9cf3;font-weight:500;margin-top:20px;font-size: 16px;display:flex;justify-content:center;}
                  .duelcards{display: grid;grid-template-columns: 150px 150px;position: absolute;text-align: center;white-space:nowrap;grid-gap: 35px;}
                  .mw-display{position:absolute;margin-left: 115px;margin-top: 185px;}
                  .mwimgstats2{display: grid;grid-template-columns: 280px 280px;position: absolute;text-align: center;white-space:nowrap;grid-gap: 125px;}
                  .mm-button-top{padding-right: 20px;padding-left: 20px;padding-bottom: 10px;padding-top: 10px;;margin-right:6px;background-color: var(--brand-experiment);font-size: 16px;font-weight: 500;;color: white;font-family: var( --font-primary);border-radius:5px;}
                  .mm-button-top:hover{background-color: var(--brand-experiment-560)}
                  .mm-button-top:active{background-color: var(--brand-experiment-600)}
                  #sw-select select {right: 20px;padding-left: 13px;padding-bottom: 10px;padding-top: 10px;margin-right:6px;background-color: var(--brand-experiment);font-size: 16px;font-weight: 500;;color: white;font-family: var( --font-primary);border-radius:5px;border: none;-webkit-appearance: none;padding-right: 12px;}
                  #sw-select select:hover{background-color: var(--brand-experiment-560)}
                  #sw-select select:active{background-color: var(--brand-experiment-600)}
                  #sw-select option{background-color: var(--brand-experiment);}
                  .sw-button-top{padding-right: 20px;padding-left: 20px;padding-bottom: 10px;padding-top: 10px;;margin-right:6px;background-color: var(--brand-experiment);font-size: 16px;font-weight: 500;;color: white;font-family: var( --font-primary);border-radius:5px;}
                  .sw-button-top:hover{background-color: var(--brand-experiment-560)}
                  .sw-button-top:active{background-color: var(--brand-experiment-600)}
                  #ranked_rating {margin-top: 180px;}
                  .rswimgstats2{display: grid;grid-template-columns: 280px 280px;text-align: center;white-space:nowrap;grid-gap: 115px;}
                  .sh-button-top{padding-right: 20px;padding-left: 20px;padding-bottom: 10px;padding-top: 10px;;margin-right:6px;background-color: var(--brand-experiment);font-size: 16px;font-weight: 500;;color: white;font-family: var( --font-primary);border-radius:5px;}
                  .sh-button-top:hover{background-color: var(--brand-experiment-560)}
                  .sh-button-top:active{background-color: var(--brand-experiment-600)}
                  .suhc-button-top{padding-right: 20px;padding-left: 20px;padding-bottom: 10px;padding-top: 10px;;margin-right:6px;background-color: var(--brand-experiment);font-size: 16px;font-weight: 500;;color: white;font-family: var( --font-primary);border-radius:5px;}
                  .suhc-button-top:hover{background-color: var(--brand-experiment-560)}
                  .suhc-button-top:active{background-color: var(--brand-experiment-600)}
                  .tntcards3{display: grid;grid-template-columns: 110px 110px 110px;position: absolute;text-align: center;white-space:nowrap;grid-gap: 0px;}
                  .uhc-button-top{padding-right: 20px;padding-left: 20px;padding-bottom: 10px;padding-top: 10px;;margin-right:6px;background-color: var(--brand-experiment);font-size: 16px;font-weight: 500;;color: white;font-family: var( --font-primary);border-radius:5px;}
                  .uhc-button-top:hover{background-color: var(--brand-experiment-560)}
                  .uhc-button-top:active{background-color: var(--brand-experiment-600)}
                  .wr-button-top{padding-right: 20px;padding-left: 20px;padding-bottom: 10px;padding-top: 10px;;margin-right:6px;background-color: var(--brand-experiment);font-size: 16px;font-weight: 500;;color: white;font-family: var( --font-primary);border-radius:5px;}
                  .wr-button-top:hover{background-color: var(--brand-experiment-560)}
                  .wr-button-top:active{background-color: var(--brand-experiment-600)}
                  .ab-button-top{padding-right: 20px;padding-left: 20px;padding-bottom: 10px;padding-top: 10px;;margin-right:6px;background-color: var(--brand-experiment);font-size: 16px;font-weight: 500;;color: white;font-family: var( --font-primary);border-radius:5px;}
                  .ab-button-top:hover{background-color: var(--brand-experiment-560)}
                  .ab-button-top:active{background-color: var(--brand-experiment-600)}
                  .quake-button-top{padding-right: 20px;padding-left: 20px;padding-bottom: 10px;padding-top: 10px;;margin-right:6px;background-color: var(--brand-experiment);font-size: 16px;font-weight: 500;;color: white;font-family: var( --font-primary);border-radius:5px;}
                  .quake-button-top:hover{background-color: var(--brand-experiment-560)}
                  .quake-button-top:active{background-color: var(--brand-experiment-600)}
                  
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

            var blitz_level = {
                "1": 0,
                "2": 100,
                "3": 250,
                "4": 500,
                "5": 1000,
                "6": 150,
                "7": 2000,
                "8": 2500,
                "9": 5000,
                "10": 10000
              }
            
            var blitz_kits = {
              "horsetamer": "https://i.imgur.com/tYmhNAP.png",
              "ranger": "https://i.imgur.com/0ZgtRqs.png",
              "archer": "https://i.imgur.com/3VlyJFe.png",
              "astronaut": "https://i.imgur.com/6iqigSq.png",
              "troll": "https://i.imgur.com/sksN3ES.png",
              "meatmaster": "https://i.imgur.com/gaPoMmG.png",
              "reaper": "https://i.imgur.com/UxDvKw1.png",
              "reddragon": "https://i.imgur.com/wBv9f0F.png",
              "toxicologist": "https://i.imgur.com/Lg2v0to.png",
              "donkeytamer": "https://i.imgur.com/U6iwB4E.png",
              "rogue": "https://i.imgur.com/xmnbh20.png",
              "warlock": "https://i.imgur.com/dbklfIn.png",
              "slimeyslime": "https://i.imgur.com/oplG7O1.png",
              "jockey": "https://i.imgur.com/ITqFPLb.png",
              "golem": "https://i.imgur.com/WwBftfd.png",
              "viking": "https://i.imgur.com/robFfMX.png",
              "speleologist": "https://i.imgur.com/SmoHICv.png",
              "shadow knight": "https://i.imgur.com/3kITzy2.png",
              "baker": "https://i.imgur.com/KvmHpoy.png",
              "knight": "https://i.imgur.com/tNGe3Ve.png",
              "pigman": "https://i.imgur.com/1nLpJ1F.png",
              "guardian": "https://i.imgur.com/5wLCKBY.png",
              "phoenix": "https://i.imgur.com/oFpWhhP.png",
              "paladin": "https://i.imgur.com/BPYCyNK.png",
              "necromancer": "https://i.imgur.com/tABXOpT.png",
              "scout": "https://i.imgur.com/eHUQ3oa.png",
              "hunter": "https://i.imgur.com/TytRf04.png",
              "warrior": "https://i.imgur.com/ySv5b2H.png",
              "hype train": "https://i.imgur.com/M272zBj.png",
              "fisherman": "https://i.imgur.com/AGCqxz0.png",
              "florist": "https://i.imgur.com/Ul6wOIc.png",
              "diver": "https://i.imgur.com/GqfbQkW.png",
              "arachnologist": "https://i.imgur.com/KZr5UE6.png",
              "blaze": "https://i.imgur.com/ip63VQ3.png",
              "wolftamer": "https://i.imgur.com/H93P0SC.png",
              "tim": "https://i.imgur.com/N8PsYzZ.png",
              "snowman": "https://i.imgur.com/t0ShNBR.png",
              "farmer": "https://i.imgur.com/l25VBqm.png",
              "armorer": "https://i.imgur.com/a1BtP3a.png",
              "creepertamer": "https://i.imgur.com/2iqvtHM.png"
            }

              var __webpack_modules__ = {
                832: module => {
                  module.exports = BdApi.React;
                }
              };
              var __webpack_module_cache__ = {};
              function __webpack_require__(moduleId) {
                var cachedModule = __webpack_module_cache__[moduleId];
                if (void 0 !== cachedModule) return cachedModule.exports;
                var module = __webpack_module_cache__[moduleId] = {
                  exports: {}
                };
                __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
                return module.exports;
              }
              (() => {
                __webpack_require__.n = module => {
                  var getter = module && module.__esModule ? () => module["default"] : () => module;
                  __webpack_require__.d(getter, {
                    a: getter
                  });
                  return getter;
                };
              })();
              (() => {
                __webpack_require__.d = (exports, definition) => {
                  for (var key in definition)
                    if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, {
                      enumerable: true,
                      get: definition[key]
                    });
                };
              })();
              (() => {
                __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
              })();
              (() => {
                __webpack_require__.r = exports => {
                  if ("undefined" !== typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports, Symbol.toStringTag, {
                    value: "Module"
                  });
                  Object.defineProperty(exports, "__esModule", {
                    value: true
                  });
                };
              })();

              const React = __webpack_require__(832)
              

            return class StatsifyStats extends Plugin {

              
                
                
                onLoad () {
                  this.defaults = {
                    popsize: {
                      size:				{value: 100,				description: "Popover window size"}
                    },
                    settings: {
                      guildmember:      {value: false,        name: "Display Guild Members"},
                      gexp:             {value: false,        name: "Display Weekly Gexp Instead of Daily"},
                      days:             {vale : false,        name: "Display Join Date Instead of Days Ago"}
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

                    document.body.appendChild(popover)
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
              if (searchField) {
                  searchField.addEventListener('keyup', event => {
                  if (event.keyCode === 13) this.getUUID()
                })
              }

              document.getElementById("back-arrow-icon") ? document.getElementById("back-arrow-icon").onclick = this.backArrow : null

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
                  uuid = tuuid.replace(/-/g, "")

                  document.getElementById("bodyResult").innerHTML = ''
                  this.statLoader()
                  const body = JSON.parse(res.body);
                  player = body?.player

                  rank = this.getRank(player)
                  plusColor = this.getPlusColor(rank, player.rankPlusColor)
                  formattedRank = this.getFormattedRank(rank, plusColor.mc)

                  const ign = `${formattedRank}${player.displayname}`
                  displayName = this.mcColorParser(ign)


                  if (player) this.getLeaderboard()
                }
                  else {
                    BDFDB.NotificationUtils.toast("Server or Api is Down", {type: "danger"});
                    document.getElementById("bodyResult").innerHTML = '';
                  }
            })
        }

        getLeaderboard() {
          BDFDB.LibraryRequires.request(`https://api.hypixel.net/leaderboards?key=${apiKey}`, (err, res) => {
            var body  = JSON.parse(res.body)
 
            if (res.statusCode == 200) {
              lb = body?.leaderboards
            }
              else BDFDB.NotificationUtils.toast("An error occurred with hypixel's leaderboards", {type: "danger"})
 
            if (body) this.getRankedSkywars()
          })
        }
        
        getRankedSkywars() {
          BDFDB.LibraryRequires.request(`https://api.hypixel.net/player/ranked/skywars?key=${apiKey}&uuid=${uuid}`, (err, res) => {
            let body  = JSON.parse(res.body)
 
            if (res.statusCode == 200) {
              rr = body?.result
            }
              else BDFDB.NotificationUtils.toast("An error occurred with hypixel's ranked stats", {type: "danger"})
 
            if (body) this.getHyapi()
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
                  const getGuildTagColor = color => ({ "DARK_AQUA": { hex: "#00AAAA", mc: "??3" }, "DARK_GREEN": { hex: "#00AA00", mc: "??2" }, "YELLOW": { hex: "#FFFF55", mc: "??e" }, "GOLD": { hex: "#FFAA00", mc: "??6" } }[color] || { hex: "#AAAAAA", mc: "??7" })

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
          let number = string || 0
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
            if ((player).prefix) rank = (player).prefix.replace(/??.|\[|]/g, '');
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
                'MVP+': { mc: '??c', hex: '#FF5555' },
                'MVP++': { mc: '??c', hex: '#FFAA00' },
                'VIP+': { mc: '??6', hex: '#FFAA00' },
                'PIG+++': { mc: '??b', hex: '#FF55FF' },
              }[rank]
              if (!rankColor) return { mc: '??7', hex: '#BAB6B6' }
            } else {
              var rankColorMC = {
                RED: { mc: '??c', hex: '#FF5555' },
                GOLD: { mc: '??6', hex: '#FFAA00' },
                GREEN: { mc: '??a', hex: '#55FF55' },
                YELLOW: { mc: '??e', hex: '#FFFF55' },
                LIGHT_PURPLE: { mc: '??d', hex: '#FF55FF' },
                WHITE: { mc: '??f', hex: '#F2F2F2' },
                BLUE: { mc: '??9', hex: '#5555FF' },
                DARK_BLUE: { mc: '??1', hex: '#0000AA' },
                DARK_GREEN: { mc: '??2', hex: '#00AA00' },
                DARK_RED: { mc: '??4', hex: '#AA0000' },
                DARK_AQUA: { mc: '??3', hex: '#00AAAA' },
                DARK_PURPLE: { mc: '??5', hex: '#AA00AA' },
                DARK_GRAY: { mc: '??8', hex: '#555555' },
                BLACK: { mc: '??0', hex: '#000000' },
              }[plus]
              if (!rankColorMC) return { mc: '??7', hex: '#BAB6B6' }
            }
            return rankColor || rankColorMC;
          }

          getFormattedRank = (rank, color) => {
            rank = { 'MVP+': `??b[MVP${color}+??b]`, 'MVP++': `??6[MVP${color}++??6]`, 'MVP': '??b[MVP]', 'VIP+': `??a[VIP${color}+??a]`, 'VIP': `??a[VIP]`, 'YOUTUBE': `??c[??fYOUTUBE??c]`, 'PIG+++': `??d[PIG${color}+++??d]`, 'HELPER': `??9[HELPER]`, 'MOD': `??2[MOD]`, 'ADMIN': `??c[ADMIN]`, 'OWNER': `??c[OWNER]`, 'SLOTH': `??c[SLOTH]`, 'ANGUS': `??c[ANGUS]`, 'APPLE': '??6[APPLE]', 'MOJANG': `??6[MOJANG]`, 'BUILD TEAM': `??3[BUILD TEAM]`, 'EVENTS': `??6[EVENTS]` }[rank]
            if (!rank) return `??7`
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
            var splitText = text.replace(/??l/g, "").split("??").slice(1)
            var finalText = ""
          
            splitText.forEach(parts => finalText += `<span class="${colors[parts[0]]?.color == undefined ? `white` : colors[parts[0]].color} shadow">${parts.split("").slice(1).join("")}</span>`)
            return finalText
          }

          toTitleCase(str) {
            return str.replace(/\w\S*/g, function(txt){
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
          }
          
          getLevelFormatted(level) {
            const prestige = Math.floor(level / 100);
            const levelCharsReversed = level.toString().split('').reverse();
          
            switch (prestige) {
              case 0: return `??7[${level}<span style="font-size:1.35em">\u272B</span>]`;
              case 1: return `??f[${level}<span style="font-size:1.35em">\u272B</span>]`;
              case 2: return `??6[${level}<span style="font-size:1.35em">\u272B</span>]`;
              case 3: return `??b[${level}<span style="font-size:1.35em">\u272B</span>]`;
              case 4: return `??2[${level}<span style="font-size:1.35em">\u272B</span>]`;
              case 5: return `??3[${level}<span style="font-size:1.35em">\u272B</span>]`;
              case 6: return `??4[${level}<span style="font-size:1.35em">\u272B</span>]`;
              case 7: return `??d[${level}<span style="font-size:1.35em">\u272B</span>]`;
              case 8: return `??9[${level}<span style="font-size:1.35em">\u272B</span>]`;
              case 9: return `??5[${level}<span style="font-size:1.35em">\u272B</span>]`;
          
              case 10: return `??c[??6${levelCharsReversed[3]}??e${levelCharsReversed[2]}??a${levelCharsReversed[1]}??b${levelCharsReversed[0]}??d<span style="font-size:1.35em">\u272B</span>??5]`;
              case 11: return `??7[??f${level}??7<span style="font-size:1.35em">\u272A</span>]`;
              case 12: return `??7[??e${level}??6<span style="font-size:1.35em">\u272A</span>??7]`;
              case 13: return `??7[??b${level}??3<span style="font-size:1.35em">\u272A</span>??7]`;
              case 14: return `??7[??a${level}??2<span style="font-size:1.35em">\u272A</span>??7]`;
              case 15: return `??7[??3${level}??9<span style="font-size:1.35em">\u272A</span>??7]`;
              case 16: return `??7[??c${level}??4<span style="font-size:1.35em">\u272A</span>??7]`;
              case 17: return `??7[??d${level}??5<span style="font-size:1.35em">\u272A</span>??7]`;
              case 18: return `??7[??9${level}??1<span style="font-size:1.35em">\u272A</span>??7]`;
              case 19: return `??7[??5${level}??8<span style="font-size:1.35em">\u272A</span>??7]`;
          
              case 20: return `??8[??7${levelCharsReversed[3]}??f${levelCharsReversed[2]}${levelCharsReversed[1]}??7${levelCharsReversed[0]}<span style="font-size:1.35em">\u272A</span>??8]`;
              case 21: return `??f[${levelCharsReversed[3]}??e${levelCharsReversed[2]}${levelCharsReversed[1]}??6${levelCharsReversed[0]}??l<span style="font-size:1.35em">\u269D</span>??6]`;
              case 22: return `??6[${levelCharsReversed[3]}??f${levelCharsReversed[2]}${levelCharsReversed[1]}??b${levelCharsReversed[0]}??l<span style="font-size:1.35em">\u269D</span>??b]`;
              case 23: return `??5[${levelCharsReversed[3]}??d${levelCharsReversed[2]}${levelCharsReversed[1]}??6${levelCharsReversed[0]}??e??l<span style="font-size:1.35em">\u269D</span>??e]`;
              case 24: return `??b[${levelCharsReversed[3]}??f${levelCharsReversed[2]}${levelCharsReversed[1]}??7${levelCharsReversed[0]}??l<span style="font-size:1.35em">\u269D</span>??8]`;
              case 25: return `??f[${levelCharsReversed[3]}??a${levelCharsReversed[2]}${levelCharsReversed[1]}??2${levelCharsReversed[0]}??l<span style="font-size:1.35em">\u269D</span>??2]`;
              case 26: return `??4[${levelCharsReversed[3]}??c${levelCharsReversed[2]}${levelCharsReversed[1]}??d${levelCharsReversed[0]}??l<span style="font-size:1.35em">\u269D</span>??5]`;
              case 27: return `??e[${levelCharsReversed[3]}??f${levelCharsReversed[2]}${levelCharsReversed[1]}??8${levelCharsReversed[0]}??l<span style="font-size:1.35em">\u269D</span>??8]`;
              case 28: return `??a[${levelCharsReversed[3]}??2${levelCharsReversed[2]}${levelCharsReversed[1]}??6${levelCharsReversed[0]}??l<span style="font-size:1.35em">\u269D</span>??e]`;
              case 29: return `??b[${levelCharsReversed[3]}??3${levelCharsReversed[2]}${levelCharsReversed[1]}??9${levelCharsReversed[0]}??l<span style="font-size:1.35em">\u269D</span>??1]`;
          
              case 30: return `??e[${levelCharsReversed[3]}??6${levelCharsReversed[2]}${levelCharsReversed[1]}??c${levelCharsReversed[0]}??l<span style="font-size:1.35em">\u269D</span>??4]`;
              default: return `??e[${levelCharsReversed[3]}??6${levelCharsReversed[2]}${levelCharsReversed[1]}??c${levelCharsReversed[0]}??l<span style="font-size:1.35em">\u269D</span>??4]`;
            }
          }

          getExpForLevel (level) {
            let progress = level % 100
            if (progress > 3) return 5000

            let levels = {
                0: 500,
                1: 1000,
                2: 2000,
                3: 3500,
            }
            return levels[progress]
          }

          getBwPrecentToNextLevel (exp) {
            let prestiges = Math.floor(exp / 487000)
            let level = prestiges * 100
            let remainingExp = exp - prestiges * 487000
            
            for (var i = 0; i < 4; ++i) {
                var expForNextLevel = this.getExpForLevel(i)
                if (remainingExp < expForNextLevel) break
                  level++
                remainingExp -= expForNextLevel
            }

            return this.precentParse(parseFloat((level + remainingExp / this.getExpForLevel(level + 1)).toFixed(2)))
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

          getGuildDays(guuid) {
            let ign = guuid || null
            let dguild = guild?.guild?.members
            let oneDay = 24 * 60 * 60 * 1000
  
            for (var xp in dguild ) {
              if (dguild[xp]?.uuid === ign)
              break;
           }
           var date1 = new Date(dguild[xp]?.joined)
           var date2 = new Date()

           var days = Math.round(Math.abs((date1 - date2) / oneDay)).toLocaleString()  + ' ' + 'days ago' ?? ' ' + '0 days ago'
           return days 
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
              let row = `<tr id="gmtb1">
                <td style="font-family:Minecraftia;text-align: left;font-size: 12px;"><img style="margin-right:10px;border-radius:4px;box-shadow: -1px 1px 10px 0px #18191c;" src="https://crafatar.com/avatars/${dguild[table]?.uuid}?size=25&overlay=true">  ${`<span style="cursor:pointer;"title="Search This Player" id="${dguild[table]?.uuid}">${this.mcColorParser(cache?.rawname) ?? `<span style="font-size: 10px"class="red shadow">*rate limit*</span>`}</span>`}</td1>
                <td>${await this.getGuildRank(dguild[table]?.uuid) || ""}</td>
                <td>${settings.gexp === true ? this.getWeeklyGuildxp(dguild[table]?.uuid) || "0" : await this.getDailyGuildxp(dguild[table]?.uuid) || "0"}</td>
                <td>${settings.days === true ? this.getGuildJoined(dguild[table]?.uuid) || "0" : this.getGuildDays(dguild[table]?.uuid) || "0"}</td>
                <td>${new Date(await cache?.lastlogout).toLocaleString() || "error"}</td>
              </tr>`
              gmtable.innerHTML += row
              } else {
                let temp = await this.getTempDisplayName(dguild[table]?.uuid)
                let row = `<tr id="gmtb2">
                <td style="font-family:Minecraftia;text-align: left;font-size: 12px;"><img style="margin-right:10px;border-radius:4px;box-shadow: -1px 1px 10px 0px #18191c;" src="https://crafatar.com/avatars/${dguild[table]?.uuid}?size=25&overlay=true">  ${`<span style="cursor:pointer;"title="Search This Player" id="${dguild[table]?.uuid}">${cache?.rawname != undefined ? this.mcColorParser(cache?.rawname) : await temp.tempDisplayName ?? `<span style="font-size: 10px"class="red shadow">*rate limit*</span>`}</span>`}</td1>
                <td>${await this.getGuildRank(dguild[table]?.uuid) || ""}</td>
                <td>${settings.gexp === true ? this.getWeeklyGuildxp(dguild[table]?.uuid) || "0" : await this.getDailyGuildxp(dguild[table]?.uuid) || "0"}</td>
                <td>${settings.days === true ? this.getGuildJoined(dguild[table]?.uuid) || "0" : this.getGuildDays(dguild[table]?.uuid) || "0"}</td>
                <td>${cache?.rawname != undefined ? new Date(await cache?.lastlogout).toLocaleString() || "error" : new Date(await temp.lastLogout).toLocaleString()}</td>
              </tr>`
              gmtable.innerHTML += row
              }

            }
            if (document.getElementById("gmtb1") || document.getElementById("gmtb2")) {
              for (let table in dguild) {
                var element = document.getElementById(`${dguild[table]?.uuid}`)
                element.addEventListener("click", () => this.getPlayer(dguild[table]?.uuid))
              }
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
                <td>${pdata[table]?.name?.includes(`??`) ? this.mcColorParser(pdata[table]?.name || "Unset Name") : pdata[table]?.name || "Unset Name"}</td>
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
              <span style="color: white;margin-right: 1px;font-size: 20px;">${player?.petStats?.[player?.currentPet]?.name?.includes(`??`) ? this.mcColorParser(player?.petStats?.[player?.currentPet]?.name) : player?.petStats?.[player?.currentPet]?.name || ""}</span>
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
            <a><span style="color: white;margin-right: 1px;font-size: 20px;">${player?.petStats?.TOTEM?.name?.includes(`??`) ? this.mcColorParser(player?.petStats?.TOTEM?.name) : player?.petStats?.TOTEM?.name || "Unset Name"}</span></a>
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

          gamesButtonLoader() {
            document.querySelectorAll(".bw-button-top").forEach((button) => {
              button.addEventListener("click", (e) => {
                e.preventDefault()
                  switch (e?.target?.id) {
                    case "bw-solob":
                      document.querySelectorAll(".bw-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("bw_solo").style.visibility = ""
                      })
                    break
                    case "bw-teamsb":
                      document.querySelectorAll(".bw-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("bw_teams").style.visibility = ""
                      })
                    break
                    case "bw-doubleb":
                      document.querySelectorAll(".bw-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("bw_double").style.visibility = ""
                      })
                    break
                    case "bw-overallb":
                      document.querySelectorAll(".bw-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("bw_overall").style.visibility = ""
                      })
                    break
                    case "bw-threeb":
                      document.querySelectorAll(".bw-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("bw_three").style.visibility = ""
                      })
                    break
                    case "bw-fourb":
                      document.querySelectorAll(".bw-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("bw_four").style.visibility = ""
                      })
                    break
                    case "bw-4v4b":
                      document.querySelectorAll(".bw-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("bw_4v4").style.visibility = ""
                      })
                    break
                  }
              })
            })
            document.querySelectorAll(".cvc-button-top").forEach((button) => {
              button.addEventListener("click", (e) => {
                e.preventDefault()
                  switch (e?.target?.id) {
                    case "cvc-defb":
                      document.querySelectorAll(".cvc-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("cvc_def").style.visibility = ""
                      })
                    break
                    case "cvc-tdmb":
                      document.querySelectorAll(".cvc-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("cvc_tdm").style.visibility = ""
                      })
                    break
                  }
              })
            })
            document.querySelectorAll(".duels-button-top").forEach((button) => {
              button.addEventListener("click", (e) => {
                e.preventDefault()
                  switch (e?.target?.id) {
                    case "duel-overallb":
                      document.querySelectorAll(".duels-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("duel-tabcontent").style.height = '532px'
                        document.getElementById("duel_overall").style.visibility = ""
                      })
                    break
                    case "duel-allb":
                      document.querySelectorAll(".duels-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("duel-tabcontent").style.height = '4570px'
                        document.getElementById("duel_all").style.visibility = ""
                      })
                    break
                  }
              })
            })
            document.getElementById("bsg-kitsb").addEventListener("click", function(){
              let kitpage = document.getElementById("bsg_kits")
              let bsgstats = document.getElementById("bsg-statss")

              if (kitpage.style.visibility !== 'hidden') {
                kitpage.style.visibility = 'hidden';
                bsgstats.style.visibility = '';
                
              }
             else {
                kitpage.style.visibility = '';
                bsgstats.style.visibility = 'hidden';
              }
            })
            document.getElementById("mw-kitsb").addEventListener("click", function(){
              let kitpage = document.getElementById("mw-kits")
              let mwstats = document.getElementById("mw-stats")

              if (kitpage.style.visibility !== 'hidden') {
                kitpage.style.visibility = 'hidden';
                mwstats.style.visibility = '';
                
              }
             else {
                kitpage.style.visibility = '';
                mwstats.style.visibility = 'hidden';
              }
            })
            document.querySelectorAll(".mm-button-top").forEach((button) => {
              button.addEventListener("click", (e) => {
                e.preventDefault()
                  switch (e?.target?.id) {
                    case "mm-as":
                      document.querySelectorAll(".mm-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("mm_as").style.visibility = ""
                      })
                    break
                    case "mm-solo":
                      document.querySelectorAll(".mm-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("mm_solo").style.visibility = ""
                      })
                    break
                    case "mm-overall":
                      document.querySelectorAll(".mm-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("mm_overall").style.visibility = ""
                      })
                    break
                    case "mm-double":
                      document.querySelectorAll(".mm-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("mm_double").style.visibility = ""
                      })
                    break
                    case "mm-infection":
                      document.querySelectorAll(".mm-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("mm_infection").style.visibility = ""
                      })
                    break
                  }
              })
            })
            document.querySelectorAll("[id=sw-select] .sw-button-top").forEach(button => {
              button.addEventListener("click", e => {
                e.preventDefault()
                switch (e?.target?.id) {
                  case "sw-overall": {
                    document.querySelectorAll(".sw-display").forEach((element) => {
                      element.style.visibility = 'hidden'
                      document.getElementById("sw_overall").style.visibility = ""
                    })
                  }
                  break
                  case "sw-mega": {
                    document.querySelectorAll(".sw-display").forEach((element) => {
                      element.style.visibility = 'hidden'
                      document.getElementById("sw_mega").style.visibility = ""
                    })
                  }
                  break
                  case "sw-ranked": {
                    document.querySelectorAll(".sw-display").forEach((element) => {
                      element.style.visibility = 'hidden'
                      document.getElementById("sw_ranked").style.visibility = ""
                    })
                  }
                  break
                }
              })
            })
            document.querySelectorAll("[id=sw-select] select").forEach(button => {
              button.addEventListener("click", e => {
                e.preventDefault()
                switch (e?.target?.value) {
                  case "Solo Overall": {
                    document.querySelectorAll(".sw-display").forEach((element) => {
                      element.style.visibility = 'hidden'
                      document.getElementById("sw_solo_overall").style.visibility = ""
                    })
                  }
                  break
                  case "Solo Normal": {
                    document.querySelectorAll(".sw-display").forEach((element) => {
                      element.style.visibility = 'hidden'
                      document.getElementById("sw_solo_normal").style.visibility = ""
                    })
                  }
                  break
                  case "Solo Insane": {
                    document.querySelectorAll(".sw-display").forEach((element) => {
                      element.style.visibility = 'hidden'
                      document.getElementById("sw_solo_insane").style.visibility = ""
                    })
                  }
                  break
                  case "Doubles Overall": {
                    document.querySelectorAll(".sw-display").forEach((element) => {
                      element.style.visibility = 'hidden'
                      document.getElementById("sw_double_overall").style.visibility = ""
                    })
                  }
                  break
                  case "Doubles Normal": {
                    document.querySelectorAll(".sw-display").forEach((element) => {
                      element.style.visibility = 'hidden'
                      document.getElementById("sw_double_normal").style.visibility = ""
                    })
                  }
                  break
                  case "Doubles Insane": {
                    document.querySelectorAll(".sw-display").forEach((element) => {
                      element.style.visibility = 'hidden'
                      document.getElementById("sw_double_insane").style.visibility = ""
                    })
                  }
                  break
                }
              })
            })
            document.querySelectorAll(".sh-button-top").forEach((button) => {
              button.addEventListener("click", (e) => {
                e.preventDefault()
                  switch (e?.target?.id) {
                    case "sh-solo":
                      document.querySelectorAll(".sh-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("sh_solo").style.visibility = ""
                      })
                    break
                    case "sh-2v2":
                      document.querySelectorAll(".sh-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("sh_2v2").style.visibility = ""
                      })
                    break
                    case "sh-overall":
                      document.querySelectorAll(".sh-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("sh_overall").style.visibility = ""
                      })
                    break
                    case "sh-2v2v2":
                      document.querySelectorAll(".sh-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("sh_2v2v2").style.visibility = ""
                      })
                    break
                    case "sh-kits":
                      document.querySelectorAll(".sh-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("sh_kits").style.visibility = ""
                      })
                    break
                  }
              })
            })
            document.querySelectorAll(".suhc-button-top").forEach((button) => {
              button.addEventListener("click", (e) => {
                e.preventDefault()
                  switch (e?.target?.id) {
                    case "suhc-solos":
                      document.querySelectorAll(".suhc-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("suhc_solos").style.visibility = ""
                      })
                    break
                    case "suhc-overall":
                      document.querySelectorAll(".suhc-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("suhc_overall").style.visibility = ""
                      })
                    break
                    case "suhc-teams":
                      document.querySelectorAll(".suhc-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("suhc_teams").style.visibility = ""
                      })
                    break
                  }
              })
            })
            document.querySelectorAll(".uhc-button-top").forEach((button) => {
              button.addEventListener("click", (e) => {
                e.preventDefault()
                  switch (e?.target?.id) {
                    case "uhc-solo":
                      document.querySelectorAll(".uhc-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("uhc_solo").style.visibility = ""
                      })
                    break
                    case "uhc-overall":
                      document.querySelectorAll(".uhc-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("uhc_overall").style.visibility = ""
                      })
                    break
                    case "uhc-teams":
                      document.querySelectorAll(".uhc-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("uhc_teams").style.visibility = ""
                      })
                    break
                  }
              })
            })
            document.querySelectorAll(".wr-button-top").forEach((button) => {
              button.addEventListener("click", (e) => {
                e.preventDefault()
                  switch (e?.target?.id) {
                    case "wr-stats":
                      document.querySelectorAll(".wr-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("wr-tabcontent").style.height = '532px'
                        document.getElementById("wr_stats").style.visibility = ""
                      })
                    break
                    case "wr-kits":
                      document.querySelectorAll(".wr-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("wr-tabcontent").style.height = '602px'
                        document.getElementById("wr_kits").style.visibility = ""
                      })
                    break
                  }
              })
            })
            document.querySelectorAll(".ab-button-top").forEach((button) => {
              button.addEventListener("click", (e) => {
                e.preventDefault()
                  switch (e?.target?.id) {
                    case "ab-overall":
                      document.querySelectorAll(".ab-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("ab_overall").style.visibility = ""
                      })
                    break
                    case "ab-1v1":
                      document.querySelectorAll(".ab-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("ab_1v1").style.visibility = ""
                      })
                    break
                    case "ab-2v2":
                      document.querySelectorAll(".ab-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("ab_2v2").style.visibility = ""
                      })
                    break
                    case "ab-4v4":
                      document.querySelectorAll(".ab-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("ab_4v4").style.visibility = ""
                      })
                    break
                  }
              })
            })
            document.querySelectorAll(".quake-button-top").forEach((button) => {
              button.addEventListener("click", (e) => {
                e.preventDefault()
                  switch (e?.target?.id) {
                    case "quake-solo":
                      document.querySelectorAll(".quake-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("quake_solo").style.visibility = ""
                      })
                    break
                    case "quake-overall":
                      document.querySelectorAll(".quake-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("quake_overall").style.visibility = ""
                      })
                    break
                    case "quake-teams":
                      document.querySelectorAll(".quake-display").forEach((element) => {
                        element.style.visibility = 'hidden'
                        document.getElementById("quake_teams").style.visibility = ""
                      })
                    break
                  }
              })
            })
          }

          getBwMainMode() {
            let solo = player?.stats?.Bedwars?.eight_one_games_played_bedwars || 0
            let double = player?.stats?.Bedwars?.eight_two_games_played_bedwars || 0
            let three = player?.stats?.Bedwars?.four_three_games_played_bedwars || 0
            let four = player?.stats?.Bedwars?.four_four_games_played_bedwars || 0
            let fourfour = player?.stats?.Bedwars?.two_four_games_played_bedwars || 0

            switch (Math.max(solo, double, three, four, fourfour)){
              case solo: return "Solos"
              case double: return "Doubles"
              case three: return "Threes"
              case four: return "Fours"
              case fourfour: return "4v4"
            }
            return "Unspecified"
          }

          bwBarLoader() {
            let amount = Math.round(this.getBwPrecentToNextLevel(player?.stats?.Bedwars?.Experience) / 10) % 10

            document.querySelectorAll("[id=bwbartnl]").forEach(bar => {
              for (var i = 0; i < amount; i++) {
                var element = bar.querySelector("[id=bwbartnl] div:not(.bwbaractive)")
                if (element){    
                  element.classList.add("bwbaractive");
                } 
             }
            })
          }

          LevelParser (level) {
            let number = (level || "0").toString()

            return number.replace(/??[\d]|\D/g, "")
          }

          buildBattleTitle (score, id) {
            var path = lb?.BUILD_BATTLE?.[0]?.leaders.slice(0, 10).map(value => value.replace(/-/g, ""))

            if (path.includes(id)) return `??6#${path.indexOf(id) + 1} Builder`
            if (score < 100) return "??fRookie"
            if (score < 250) return "??7Untrained"
            if (score < 500) return "??eAmateur"
            if (score < 1000) return "??aApprentice"
            if (score < 2000) return "??dExperienced"
            if (score < 3500) return "??9Seasoned"
            if (score < 5000) return "??2Trained"
            if (score < 7500) return "??3Skilled"
            if (score < 10000) return "??cTalented"
            if (score < 15000) return "??5Professional"
            if (score < Infinity) return "??4Master"

            return "??fRookie"
          }

          getBlitzExpKitLevel (kitexp) {
            var exp = player?.stats?.HungerGames?.[kitexp] || 0

            if (exp === 0) return 0

            for (var key in blitz_level) {
              if (exp < blitz_level[key]) break

            }
            return key
          }

          getBlitzKitLevel (kitname) {
            let data = player?.stats?.HungerGames ?? {}
            let basicKits = ['archer','meatmaster','speleologist','baker','knight','guardian','scout','hunter','hype train','fisherman','armorer']
            let expKits = ['donkeytamer', 'warrior', 'ranger', 'phoenix']

            if (`p${kitname}` in data) return data[`p${kitname}`] === 1 ? `???` : `??????`
            else if (kitname in data) return data[kitname] + 1
            else if (basicKits.includes(kitname)) return 1
            else if (expKits.includes(kitname)) return this.getBlitzExpKitLevel(`exp_${kitname}`)
            else return 0
          }

          blitzKitImageLoader() {
            let body = document.getElementById("kits_body")
            let kits = new Map()

            for (var kit in blitz_kits) {
              kits.set(kit, [kit, this.getBlitzKitLevel(kit), blitz_kits[kit]])
            }

            kits.forEach(element => {
              let kitname = element[0]
              let kitlevel = element[1]
              let kitimg = element[2]
              
              let img = kitlevel === 0 ? "" : `<div>
              ${['???', '??????'].includes(kitlevel) ? `<img title="${this.toTitleCase(kitname)}" style="width:56px" src="${kitimg}"><span style="font-family:Minecraftia;font-size:25px;text-align:center;" class="gold shadow">${kitlevel}</span>` : `<img title="${this.toTitleCase(kitname)}" style="width:56px" src="${kitimg}"><span style="font-family:Minecraftia;font-size:20px;text-align:center;" class="dark_red shadow">${this.romanize(kitlevel)}</span>`}
              </div>`
              body.innerHTML += img
            })
          }

          romanize(num) {
            var lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},roman = '',i;
            for ( i in lookup ) {
              while ( num >= lookup[i] ) {
                roman += i;
                num -= lookup[i];
              }
            }
            return roman;
          }

          getBlitzKillCounter(kills) {
            if (kills < 1000) return `??f[??7${kills.toLocaleString()}??f]`
            if (kills < 25000) return `??e[${kills.toLocaleString()}]`
            if (kills < 50000) return `??a[${kills.toLocaleString()}]`
            if (kills < 75000) return `??c[${kills.toLocaleString()}]`
            if (kills < 100000) return `??b[${kills.toLocaleString()}]` 
            if (kills < 150000) return `??6[${kills.toLocaleString()}]`
            if (kills < 200000) return `??5[${kills.toLocaleString()}]`
            if (kills < 250000) return `??4[${kills.toLocaleString()}]`
            if (kills < 300000) return `??9[${kills.toLocaleString()}]`
            if (kills < Infinity) return `??2[${kills.toLocaleString()}]`

            return `??f[??7${kills.toLocaleString()}??f]`
          }

          getBlitzMainMode() {
            let solo = player?.stats?.HungerGames?.kills_solo_normal || 0
            let teams = player?.stats?.HungerGames?.kills_teams_normal || 0

            switch (Math.max(solo, teams)) {
              case solo: return "Solo"
              case teams: return "Teams"
            }
          }

          getBlitzTotalKits() {
            let kits = new Map()

            for (var kit in blitz_kits) {
              this.getBlitzKitLevel(kit) === 0 ? null : kits.set([this.getBlitzKitLevel(kit)])
            }
            return kits.size
          }

          getCvcMainMode() {
            let def = player?.stats?.MCGO?.game_plays || 0
            let dm = player?.stats?.MCGO?.games_plays_deathmatch || 0

            switch (Math.max(def, dm)) {
              case def: return "Defusal"
              case dm: return "Death Match"
            }
          }

          getDuelsMainMode() {
          let sumo = player?.stats?.Duels?.sumo_duel_rounds_played || 0
          let bow = player?.stats?.Duels?.bow_duel_rounds_played || 0
          let combo = player?.stats?.Duels?.combo_duel_rounds_played || 0
          let potion = player?.stats?.Duels?.potion_duel_rounds_played || 0
          let bowSpleef = player?.stats?.Duels?.bowspleef_duel_rounds_played|| 0
          let classic = player?.stats?.Duels?.classic_duel_rounds_played || 0
          let blitz = player?.stats?.Duels?.blitz_duel_rounds_played || 0
          let swSolo = player?.stats?.Duels?.sw_duel_rounds_played || 0
          let swDoubles = player?.stats?.Duels?.sw_doubles_rounds_played || 0
          let opSolo = player?.stats?.Duels?.op_duel_rounds_played || 0
          let opDoubles = player?.stats?.Duels?.op_doubles_rounds_played || 0
          let mwSolo = player?.stats?.Duels?.mw_duel_rounds_played || 0
          let mwDoubles = player?.stats?.Duels?.mw_doubles_rounds_played || 0
          let bridgeSolo = player?.stats?.Duels?.bridge_duel_rounds_played || 0
          let bridgeDoubles = player?.stats?.Duels?.bridge_doubles_rounds_played || 0
          let bridgeFour = player?.stats?.Duels?.bridge_four_rounds_played || 0
          let bridgeTwoFour = player?.stats?.Duels?.bridge_2v2v2v2_rounds_played || 0
          let bridgeThreeFour = player?.stats?.Duels?.bridge_3v3v3v3_rounds_played || 0
          let uhcSolo = player?.stats?.Duels?.uhc_duel_rounds_played || 0
          let uhcDouble = player?.stats?.Duels?.uhc_doubles_rounds_played || 0
          let uhcFour = player?.stats?.Duels?.uhc_four_rounds_played || 0
          let uhcMeetup = player?.stats?.Duels?.uhc_meetup_rounds_played || 0

            switch(Math.max(sumo, bow, combo, potion, bowSpleef, classic, blitz, swSolo, swDoubles, opSolo, opDoubles, mwSolo, mwDoubles, bridgeSolo, bridgeDoubles, bridgeFour, bridgeTwoFour, bridgeThreeFour, uhcSolo, uhcDouble, uhcFour, uhcMeetup)) {
              case sumo: return "Sumo"
              case bow: return "Bow"
              case combo: return "Combo"
              case potion: return "NoDebuff"
              case bowSpleef: return "Bow Spleef"
              case classic: return "Classic"
              case blitz: return "Blitz"
              case swSolo: return "SkyWars Solo"
              case swDoubles: return "SkyWars Doubles"
              case opSolo: return "Op Solo"
              case opDoubles: return "Op Doubles"
              case mwSolo: return "Mega Walls Solo"
              case mwDoubles: return "Mega Walls Doubles"
              case bridgeSolo: return "Bridge Solo"
              case bridgeDoubles: return "Bridge Doubles"
              case bridgeFour: return "Bridge Fours"
              case bridgeTwoFour: return "Bridge 2v2v2v2"
              case bridgeThreeFour: return "Bridge 3v3v3v3"
              case uhcSolo: return "UHC Solo"
              case uhcDouble: return "UHC Double"
              case uhcFour: return "UHC Four"
              case uhcMeetup: return "UHC Meetup"
            }
          }

          getDuelsTitle(wins) {
            if (wins < 120) return "??8Rookie"
            if (wins < 140) return "??8Rookie II"
            if (wins < 160) return "??8Rookie III"
            if (wins < 180) return "??8Rookie IV"

            if (wins < 200) return "??8Rookie V"
            if (wins < 260) return "??7Iron"
            if (wins < 320) return "??7Iron II"
            if (wins < 380) return "??7Iron III"
            if (wins < 440) return "??7Iron IV"

            if (wins < 500) return "??7Iron V"
            if (wins < 600) return "??6Gold"
            if (wins < 700) return "??6Gold II"
            if (wins < 800) return "??6Gold III"
            if (wins < 900) return "??6Gold IV"

            if (wins < 1000) return "??6Gold V"
            if (wins < 1200) return "??bDiamond"
            if (wins < 1400) return "??bDiamond II"
            if (wins < 1600) return "??bDiamond III"
            if (wins < 1800) return "??bDiamond IV"
            
            if (wins < 2000) return "??bDiamond V"
            if (wins < 2400) return "??2Master"
            if (wins < 2800) return "??2Master II"
            if (wins < 3200) return "??2Master III"
            if (wins < 3600) return "??2Master IV"
            
            if (wins < 4000) return "??2Master V"
            if (wins < 5200) return "??4Legend"
            if (wins < 6400) return "??4Legend II"
            if (wins < 7600) return "??4Legend III"
            if (wins < 8800) return "??4Legend IV"
            
            if (wins < 10000) return "??4Legend V"
            if (wins < 12000) return "??eGrandmaster"
            if (wins < 14000) return "??eGrandmaster II"
            if (wins < 16000) return "??eGrandmaster III"
            if (wins < 18000) return "??eGrandmaster IV"
            
            if (wins < 20000) return "??eGrandmaster V"
            if (wins < 24000) return "??5Godlike"
            if (wins < 28000) return "??5Godlike II"
            if (wins < 32000) return "??5Godlike III"
            if (wins < 36000) return "??5Godlike IV"
            if (wins < 40000) return "??5Godlike V"
            if (wins < 44000) return "??5Godlike VI"
            if (wins < 48000) return "??5Godlike VII"
            if (wins < 52000) return "??5Godlike VIII"
            if (wins < 56000) return "??5Godlike IX"
            if (wins < Infinity) return "??5Godlike X"
          }

          getMmMainMode() {
            let as = player?.stats?.MurderMystery?.games_MURDER_ASSASSINS || 0
            let solo = player?.stats?.MurderMystery?.games_MURDER_CLASSIC || 0
            let doubles = player?.stats?.MurderMystery?.games_MURDER_DOUBLE_UP || 0
            let infection = player?.stats?.MurderMystery?.games_MURDER_INFECTION || 0
            
            switch(Math.max(as, solo, doubles, infection)) {
              case as: return "Assasins"
              case solo: return "Classic Solo"
              case doubles: return "Classic Double Up"
              case infection: return "Infection"
            }
          }

          getSwBracketColor(level) {
            let number = this.LevelParser(level)

            if (number < 10) return "??f"
            if (number < 15) return "??6"
            if (number < 20) return "??b"
            if (number < 25) return "??2"
            if (number < 30) return "??3"
            if (number < 35) return "??4"
            if (number < 40) return "??d"
            if (number < 45) return "??9"
            if (number < 50) return "??5"
            if (number < Infinity) return "??c"

            return "??f"
          }

          getFormatedSkywarsBracket() {
            return `${this.mcColorParser(`${this.getSwBracketColor(player?.stats?.SkyWars?.levelFormatted)}[${player?.stats?.SkyWars?.levelFormatted}${this.getSwBracketColor(player?.stats?.SkyWars?.levelFormatted)}]`)}`
          }

          getSwMainMode() {
            let solo = player?.stats?.SkyWars?.games_solo || 0
            let double = player?.stats?.SkyWars?.games_team || 0
            let mega = player?.stats?.SkyWars?.games_mega || 0
            let lab = player?.stats?.SkyWars?.games_lab || 0
            let ranked = player?.stats?.SkyWars?.games_ranked || 0

            switch (Math.max(solo, double, mega, lab, ranked)) {
              case solo: return "Solo"
              case double: return "Doubles"
              case mega: return "Mega"
              case lab: return "Lab"
              case ranked: return "Ranked"
            }
          }

          rankedKitParser (kit) {
            var text = (kit || "Random").replace("kit_ranked_ranked_", "").replace(/_/g, " ").toLowerCase()

            return this.toTitleCase(text)
          }

          rankedRatingLoader() {
            let body = document.getElementById("ranked_rating")

            for(var i = 0; i < 5; i++) {
              let date = new Date()
              date.setDate(1)
              date.setMonth(date.getMonth() - i)

              let year = date.getFullYear().toString().substr(2,2)
              let month = date.getMonth()
              let cleanMonth = ("0" + (date.getMonth())).slice(-2)

              let reqDate = month + "_" + year
              let finalDate = cleanMonth + "-" + year

              let rating = player?.stats?.SkyWars?.[`SkyWars_skywars_rating_${reqDate}_rating`] || 0
              let position = player?.stats?.SkyWars?.[`SkyWars_skywars_rating_${reqDate}_position`] || 0

              let table = `<h1 class="rswimgstats2" style="margin-top:15px;">
              <a></a>
              <a><span style="font-size:20px;font-family:Minecraftia" class="white shadow">${finalDate}:</span><span style="margin-left:10px;font-size:20px;font-family:Minecraftia" class="gold shadow">${(rating).toLocaleString()} (#${(position).toLocaleString()})</span></a>
              </h1>`

              body.innerHTML += table
            }
          }

          getShMainMode () {
            let solo = player?.stats?.SuperSmash?.games_normal || 0
            let doubles = player?.stats?.SuperSmash?.games_2v2 || 0
            let teams = player?.stats?.SuperSmash?.games_teams || 0

            switch(Math.max(solo, doubles, teams)) {
              case solo: return "Solo"
              case doubles: return "2v2"
              case teams: return "2v2v2"
            }
          }

          getSpeedUhcMainMode () {
            let solo = player?.stats?.SpeedUHC?.games_solo || 0
            let teams = player?.stats?.SpeedUHC?.games_team || 0

            switch(Math.max(solo, teams)) {
              case solo: return "Solos"
              case teams: return "Teams"
            }
          }

          getSpeedUhcTitle (score) {
            if (score < 50) return {"level": 1, "formattedLevel": "??d[1???]", "title": "Hiker"}
            if (score < 300) return {"level": 2, "formattedLevel": "??d[2???]", "title": "Jogger"}
            if (score < 1050) return {"level": 3, "formattedLevel": "??d[3???]", "title": "Runner"}
            if (score < 2550) return {"level": 4, "formattedLevel": "??d[4???]", "title": "Sprinter"}
            if (score < 5550) return {"level": 5, "formattedLevel": "??d[5???]", "title": "Turbo"}
            if (score < 15550) return {"level": 6, "formattedLevel": "??d[6???]", "title": "Sanic"}
            if (score < 30550) return {"level": 7, "formattedLevel": "??d[7???]", "title": "Hot Rod"}
            if (score < 55550) return {"level": 8, "formattedLevel": "??d[8???]", "title": "Bolt"}
            if (score < 85550) return {"level": 9, "formattedLevel": "??d[9???]", "title": "Zoom"}
            if (score < Infinity) return {"level": 10, "formattedLevel": "??d[10???]", "title": "God Speed"}

            return {"level": 1, "formattedLevel": "??d[1???]", "title": "Hiker"}
          }
          
          str_pad_left(string,pad,length) {
            return (new Array(length+1).join(pad)+string).slice(-length);
          }

          secToTime (time) {
            let minutes = Math.floor(time / 60);
            let seconds = time - minutes * 60;
            let hours = Math.floor(time / 3600);
            time = time - hours * 3600;

            let finalTime = this.str_pad_left(minutes,'0',2)+':'+this.str_pad_left(seconds,'0',2);

              return finalTime
          }

          getUhcTitle (score) {
            if (score < 10) return {"level": 1, "formattedLevel": "??6[1???]", "title": "Recruit"}
            if (score < 60) return {"level": 2, "formattedLevel": "??6[2???]", "title": "Initiate"}
            if (score < 210) return {"level": 3, "formattedLevel": "??6[3???]", "title": "Soldier"}
            if (score < 460) return {"level": 4, "formattedLevel": "??6[4???]", "title": "Sergeant"}
            if (score < 960) return {"level": 5, "formattedLevel": "??6[5???]", "title": "Knight"}
            if (score < 1710) return {"level": 6, "formattedLevel": "??6[6???]", "title": "Captain"}
            if (score < 2710) return {"level": 7, "formattedLevel": "??6[7???]", "title": "Centurion"}
            if (score < 5210) return {"level": 8, "formattedLevel": "??6[8???]", "title": "Gladiator"}
            if (score < 10210) return {"level": 9, "formattedLevel": "??6[9???]", "title": "Warlord"}
            if (score < 13210) return {"level": 10, "formattedLevel": "??6[10???]", "title": "Champion"}
            if (score < 16210) return {"level": 11, "formattedLevel": "??6[11???]", "title": "Champion"}
            if (score < 19210) return {"level": 12, "formattedLevel": "??6[12???]", "title": "Bronze Champion"}
            if (score < 22210) return {"level": 13, "formattedLevel": "??6[13???]", "title": "Silver Champion"}
            if (score < 25210) return {"level": 14, "formattedLevel": "??6[14???]", "title": "Gold Champion"}
            if (score < Infinity) return {"level": 15, "formattedLevel": "??6[15???]", "title": "High Champion"}

            return {"level": 1, "formattedLevel": "??6[1???]", "title": "Recruit"}
          }

          getAbMainMode () {
            let solo = player?.stats?.Arena?.games_1v1 || 0
            let doubles = player?.stats?.Arena?.games_2v2 || 0
            let teams = player?.stats?.Arena?.games_4v4 || 0

            switch(Math.max(solo, doubles, teams)) {
              case solo: return "1v1"
              case doubles: return "2v2"
              case teams: return "4v4"
            }
          }

          getQuakeMainMode () {
            let solo = player?.stats?.Quake?.wins || 0
            let doubles = player?.stats?.Quake?.wins_teams || 0

            switch(Math.max(solo, doubles)) {
              case solo: return "Solo"
              case doubles: return "Teams"
            }
          }


        popoverUpdater() {    
              let tempbres = document.getElementById("bodyResult")
  
              var networkLevel = ((Math.sqrt((player.networkExp || 0) + 15312.5) - 125/Math.sqrt(2))/(25*Math.sqrt(2))).toFixed(0);

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
                  <div style="height: 532px;"class="tab-content">
                    <div style="margin-bottom:15px;" class="content-center">
                    <button id="bw-solob" class="bw-button-top">Solo</button>
                    <button id="bw-teamsb" class="bw-button-top">Teams</button>
                    <button id="bw-doubleb" class="bw-button-top">Doubles</button>
                    <button id="bw-overallb" class="bw-button-top">Overall</button>
                    <button id="bw-threeb" class="bw-button-top">Threes</button>
                    <button id="bw-fourb" class="bw-button-top">Fours</button>
                    <button id="bw-4v4b" class="bw-button-top">4v4</button>
                    </div>
                    <div class="content-center">
                      <div class="bw-display content-center" style="visibility:hidden;" id="bw_solo">
                      <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/qch0OUC.png">
                      <div class="bwimgtt" style="margin-top:12px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1>${this.mcColorParser(this.getLevelFormatted(player?.achievements?.bedwars_level || 0))} ${displayName} ${gcolor}</h1></a></div>
                      <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getBwMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                        <div class="bwimgtt" style="margin-top: 440px;">
                      <a id="bwbartnl">
                        <span style="font-size:23px;font-weight:bold;"class="dark_gray shadow">[</span>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <span style="font-size:23px;font-weight:bold;"class="dark_gray shadow">]</span>
                     </a>
                     <span style="font-size:15.5px;font-family:Minecraftia;margin-left: 5px;" class="aqua shadow">${this.getBwPrecentToNextLevel(player?.stats?.Bedwars?.Experience || 0)}%</span>
                        </div>
                    <div class="bwimgbottom">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_one_winstreak || 0).toLocaleString()}</span><span class="white shadow">Winstreak</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    </div>
                    <div style="margin-top: 175px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_one_wins_bedwars || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_one_beds_broken_bedwars || 0).toLocaleString()}</span><span class="white shadow">Beds Broken</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.eight_one_final_kills_bedwars || 0) / (player?.stats?.Bedwars?.eight_one_games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Finals per Game</span></a>
                    </div>
                    <div style="margin-top: 205px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_one_losses_bedwars || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_one_beds_lost_bedwars || 0).toLocaleString()}</span><span class="white shadow">Beds Lost</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.eight_one_kills_bedwars || 0) / (player?.stats?.Bedwars?.eight_one_games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Kills per Game</span></a>
                    </div>
                    <div style="margin-top: 235px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.eight_one_wins_bedwars || 1, player?.stats?.Bedwars?.eight_one_losses_bedwars || 1)}</span><span class="white shadow">WLR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.eight_one_beds_broken_bedwars || 1, player?.stats?.Bedwars?.eight_one_beds_lost_bedwars || 1)}</span><span class="white shadow">BBLR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.eight_one_beds_broken_bedwars || 0) / (player?.stats?.Bedwars?.eight_one_games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Beds per Game</span></a>
                    </div>
                    <div style="margin-top: 305px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_one_final_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Final Kills</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_one_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_one_void_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Void Kills</span></a>
                    </div>
                    <div style="margin-top: 335px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_one_final_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Final Deaths</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_one_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_one_void_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Void Deaths</span></a>
                    </div>
                    <div style="margin-top: 365px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.eight_one_final_kills_bedwars || 1, player?.stats?.Bedwars?.eight_one_final_deaths_bedwars || 1)}</span><span class="white shadow">FKDR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.eight_one_kills_bedwars || 1, player?.stats?.Bedwars?.eight_one_deaths_bedwars || 1)}</span><span class="white shadow">KDR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.eight_one_void_kills_bedwars || 1, player?.stats?.Bedwars?.eight_one_void_deaths_bedwars || 1)}</span><span class="white shadow">VKDR</span></a>
                    </div>
                      </div>
                      <div class="bw-display content-center" style="visibility:hidden;" id="bw_teams">
                      <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/JuM8mIx.png">
                      <div class="bwimgtt" style="margin-top:12px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1>${this.mcColorParser(this.getLevelFormatted(player?.achievements?.bedwars_level || 0))} ${displayName} ${gcolor}</h1></a></div>
                      <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getBwMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                        <div class="bwimgtt" style="margin-top: 440px;">
                      <a id="bwbartnl">
                        <span style="font-size:23px;font-weight:bold;"class="dark_gray shadow">[</span>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <span style="font-size:23px;font-weight:bold;"class="dark_gray shadow">]</span>
                     </a>
                     <span style="font-size:15.5px;font-family:Minecraftia;margin-left: 5px;" class="aqua shadow">${this.getBwPrecentToNextLevel(player?.stats?.Bedwars?.Experience || 0)}%</span>
                        </div>
                    <div class="bwimgbottom">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_three_winstreak || 0) + (player?.stats?.Bedwars?.four_four_winstreak || 0)).toLocaleString()}</span><span class="white shadow">Winstreak</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    </div>
                    <div style="margin-top: 175px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_three_wins_bedwars || 0) + (player?.stats?.Bedwars?.four_four_wins_bedwars || 0)).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_three_beds_broken_bedwars || 0) + (player?.stats?.Bedwars?.four_four_beds_broken_bedwars || 0)).toLocaleString()}</span><span class="white shadow">Beds Broken</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(((player?.stats?.Bedwars?.four_three_final_kills_bedwars || 0) + (player?.stats?.Bedwars?.four_four_final_kills_bedwars || 0)) / ((player?.stats?.Bedwars?.four_three_games_played_bedwars|| 0) + (player?.stats?.Bedwars?.four_four_games_played_bedwars|| 0))).toFixed(2)}</span><span class="white shadow">Finals per Game</span></a>
                    </div>
                    <div style="margin-top: 205px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_three_losses_bedwars || 0) + (player?.stats?.Bedwars?.four_four_losses_bedwars || 0)).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_three_beds_lost_bedwars || 0) + (player?.stats?.Bedwars?.four_four_beds_lost_bedwars || 0)).toLocaleString()}</span><span class="white shadow">Beds Lost</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(((player?.stats?.Bedwars?.four_three_kills_bedwars || 0) + (player?.stats?.Bedwars?.four_four_kills_bedwars || 0)) / ((player?.stats?.Bedwars?.four_three_games_played_bedwars|| 0) + (player?.stats?.Bedwars?.four_four_games_played_bedwars|| 0))).toFixed(2)}</span><span class="white shadow">Kills per Game</span></a>
                    </div>
                    <div style="margin-top: 235px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio((player?.stats?.Bedwars?.four_three_wins_bedwars || 1) + (player?.stats?.Bedwars?.four_four_wins_bedwars || 1), (player?.stats?.Bedwars?.four_three_losses_bedwars || 1) + (player?.stats?.Bedwars?.four_four_losses_bedwars || 1))}</span><span class="white shadow">WLR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio((player?.stats?.Bedwars?.four_three_beds_broken_bedwars || 1) + (player?.stats?.Bedwars?.four_four_beds_broken_bedwars || 1), (player?.stats?.Bedwars?.four_three_beds_lost_bedwars || 1) + (player?.stats?.Bedwars?.four_four_beds_lost_bedwars || 1))}</span><span class="white shadow">BBLR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(((player?.stats?.Bedwars?.four_three_beds_broken_bedwars || 0) + (player?.stats?.Bedwars?.four_four_beds_broken_bedwars || 0)) / ((player?.stats?.Bedwars?.four_three_games_played_bedwars|| 0) + (player?.stats?.Bedwars?.four_four_games_played_bedwars|| 0))).toFixed(2)}</span><span class="white shadow">Beds per Game</span></a>
                    </div>
                    <div style="margin-top: 305px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_three_final_kills_bedwars || 0) + (player?.stats?.Bedwars?.four_four_final_kills_bedwars || 0)).toLocaleString()}</span><span class="white shadow">Final Kills</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_three_kills_bedwars || 0) + (player?.stats?.Bedwars?.four_four_kills_bedwars || 0)).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_three_void_kills_bedwars || 0) + (player?.stats?.Bedwars?.four_four_void_kills_bedwars || 0)).toLocaleString()}</span><span class="white shadow">Void Kills</span></a>
                    </div>
                    <div style="margin-top: 335px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_three_final_deaths_bedwars || 0) + (player?.stats?.Bedwars?.four_four_final_deaths_bedwars || 0)).toLocaleString()}</span><span class="white shadow">Final Deaths</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_three_deaths_bedwars || 0) + (player?.stats?.Bedwars?.four_four_deaths_bedwars || 0)).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_three_void_deaths_bedwars || 0) + (player?.stats?.Bedwars?.four_four_void_deaths_bedwars || 0)).toLocaleString()}</span><span class="white shadow">Void Deaths</span></a>
                    </div>
                    <div style="margin-top: 365px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio((player?.stats?.Bedwars?.four_three_final_kills_bedwars || 1) + (player?.stats?.Bedwars?.four_four_final_kills_bedwars || 1), (player?.stats?.Bedwars?.four_three_final_deaths_bedwars || 1) + (player?.stats?.Bedwars?.four_four_final_deaths_bedwars || 1))}</span><span class="white shadow">FKDR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio((player?.stats?.Bedwars?.four_three_kills_bedwars || 1) + (player?.stats?.Bedwars?.four_four_kills_bedwars || 1), (player?.stats?.Bedwars?.four_three_deaths_bedwars || 1) + (player?.stats?.Bedwars?.four_four_deaths_bedwars || 1))}</span><span class="white shadow">KDR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio((player?.stats?.Bedwars?.four_three_void_kills_bedwars || 1) + (player?.stats?.Bedwars?.four_four_void_kills_bedwars || 1), (player?.stats?.Bedwars?.four_three_void_deaths_bedwars || 1) + (player?.stats?.Bedwars?.four_four_void_deaths_bedwars || 1))}</span><span class="white shadow">VKDR</span></a>
                    </div>
                      </div>
                      <div class="bw-display content-center" style="visibility:hidden;" id="bw_double">
                      <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/V9IoEK6.png">
                      <div class="bwimgtt" style="margin-top:12px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1>${this.mcColorParser(this.getLevelFormatted(player?.achievements?.bedwars_level || 0, uuid))} ${displayName} ${gcolor}</h1></a></div>
                      <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getBwMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                        <div class="bwimgtt" style="margin-top: 440px;">
                      <a id="bwbartnl">
                        <span style="font-size:23px;font-weight:bold;"class="dark_gray shadow">[</span>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <span style="font-size:23px;font-weight:bold;"class="dark_gray shadow">]</span>
                     </a>
                     <span style="font-size:15.5px;font-family:Minecraftia;margin-left: 5px;" class="aqua shadow">${this.getBwPrecentToNextLevel(player?.stats?.Bedwars?.Experience || 0)}%</span>
                        </div>
                    <div class="bwimgbottom">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_two_winstreak || 0).toLocaleString()}</span><span class="white shadow">Winstreak</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    </div>
                    <div style="margin-top: 175px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_two_wins_bedwars || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_two_beds_broken_bedwars || 0).toLocaleString()}</span><span class="white shadow">Beds Broken</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.eight_two_final_kills_bedwars || 0) / (player?.stats?.Bedwars?.eight_two_games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Finals per Game</span></a>
                    </div>
                    <div style="margin-top: 205px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_two_losses_bedwars || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_two_beds_lost_bedwars || 0).toLocaleString()}</span><span class="white shadow">Beds Lost</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.eight_two_kills_bedwars || 0) / (player?.stats?.Bedwars?.eight_two_games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Kills per Game</span></a>
                    </div>
                    <div style="margin-top: 235px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.eight_two_wins_bedwars || 1, player?.stats?.Bedwars?.eight_two_losses_bedwars || 1)}</span><span class="white shadow">WLR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.eight_two_beds_broken_bedwars || 1, player?.stats?.Bedwars?.eight_two_beds_lost_bedwars || 1)}</span><span class="white shadow">BBLR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.eight_two_beds_broken_bedwars || 0) / (player?.stats?.Bedwars?.eight_two_games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Beds per Game</span></a>
                    </div>
                    <div style="margin-top: 305px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_two_final_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Final Kills</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_two_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_two_void_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Void Kills</span></a>
                    </div>
                    <div style="margin-top: 335px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_two_final_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Final Deaths</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_two_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.eight_two_void_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Void Deaths</span></a>
                    </div>
                    <div style="margin-top: 365px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.eight_two_final_kills_bedwars || 1, player?.stats?.Bedwars?.eight_two_final_deaths_bedwars || 1)}</span><span class="white shadow">FKDR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.eight_two_kills_bedwars || 1, player?.stats?.Bedwars?.eight_two_deaths_bedwars || 1)}</span><span class="white shadow">KDR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.eight_two_void_kills_bedwars || 1, player?.stats?.Bedwars?.eight_two_void_deaths_bedwars || 1)}</span><span class="white shadow">VKDR</span></a>
                    </div>
                      </div>
                      <div class="bw-display content-center" style="" id="bw_overall">
                        <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/mAVNYEo.png">
                        <div class="bwimgtt" style="margin-top:12px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1>${this.mcColorParser(this.getLevelFormatted(player?.achievements?.bedwars_level || 0))} ${displayName} ${gcolor}</h1></a></div>
                        <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getBwMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                          <div class="bwimgtt" style="margin-top: 440px;">
                        <a id="bwbartnl">
                          <span style="font-size:23px;font-weight:bold;"class="dark_gray shadow">[</span>
                          <div class="bwbar"></div>
                          <div class="bwbar"></div>
                          <div class="bwbar"></div>
                          <div class="bwbar"></div>
                          <div class="bwbar"></div>
                          <div class="bwbar"></div>
                          <div class="bwbar"></div>
                          <div class="bwbar"></div>
                          <div class="bwbar"></div>
                          <div class="bwbar"></div>
                          <span style="font-size:23px;font-weight:bold;"class="dark_gray shadow">]</span>
                       </a>
                       <span style="font-size:15.5px;font-family:Minecraftia;margin-left: 5px;" class="aqua shadow">${this.getBwPrecentToNextLevel(player?.stats?.Bedwars?.Experience || 0)}%</span>
                          </div>
                      <div class="bwimgbottom">
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.winstreak || 0).toLocaleString()}</span><span class="white shadow">Winstreak</span></a>
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                      </div>
                      <div style="margin-top: 175px;" class="bwimgstats">
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.wins_bedwars || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.beds_broken_bedwars || 0).toLocaleString()}</span><span class="white shadow">Beds Broken</span></a>
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.final_kills_bedwars || 0) / (player?.stats?.Bedwars?.games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Finals per Game</span></a>
                      </div>
                      <div style="margin-top: 205px;" class="bwimgstats">
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.losses_bedwars || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.beds_lost_bedwars || 0).toLocaleString()}</span><span class="white shadow">Beds Lost</span></a>
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.kills_bedwars || 0) / (player?.stats?.Bedwars?.games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Kills per Game</span></a>
                      </div>
                      <div style="margin-top: 235px;" class="bwimgstats">
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.wins_bedwars || 1, player?.stats?.Bedwars?.losses_bedwars || 1)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.beds_broken_bedwars || 1, player?.stats?.Bedwars?.beds_lost_bedwars || 1)}</span><span class="white shadow">BBLR</span></a>
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.beds_broken_bedwars || 0) / (player?.stats?.Bedwars?.games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Beds per Game</span></a>
                      </div>
                      <div style="margin-top: 305px;" class="bwimgstats">
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.final_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Final Kills</span></a>
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.void_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Void Kills</span></a>
                      </div>
                      <div style="margin-top: 335px;" class="bwimgstats">
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.final_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Final Deaths</span></a>
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.void_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Void Deaths</span></a>
                      </div>
                      <div style="margin-top: 365px;" class="bwimgstats">
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.final_kills_bedwars || 1, player?.stats?.Bedwars?.final_deaths_bedwars || 1)}</span><span class="white shadow">FKDR</span></a>
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.kills_bedwars || 1, player?.stats?.Bedwars?.deaths_bedwars || 1)}</span><span class="white shadow">KDR</span></a>
                      <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.void_kills_bedwars || 1, player?.stats?.Bedwars?.void_deaths_bedwars || 1)}</span><span class="white shadow">VKDR</span></a>
                      </div>
                      </div>
                      <div class="bw-display content-center" style="visibility:hidden;" id="bw_three">
                      <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/A09pPki.png">
                      <div class="bwimgtt" style="margin-top:12px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1>${this.mcColorParser(this.getLevelFormatted(player?.achievements?.bedwars_level || 0))} ${displayName} ${gcolor}</h1></a></div>
                      <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getBwMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                        <div class="bwimgtt" style="margin-top: 440px;">
                      <a id="bwbartnl">
                        <span style="font-size:23px;font-weight:bold;"class="dark_gray shadow">[</span>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <span style="font-size:23px;font-weight:bold;"class="dark_gray shadow">]</span>
                     </a>
                     <span style="font-size:15.5px;font-family:Minecraftia;margin-left: 5px;" class="aqua shadow">${this.getBwPrecentToNextLevel(player?.stats?.Bedwars?.Experience || 0)}%</span>
                        </div>
                    <div class="bwimgbottom">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_three_winstreak || 0).toLocaleString()}</span><span class="white shadow">Winstreak</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    </div>
                    <div style="margin-top: 175px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_three_wins_bedwars || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_three_beds_broken_bedwars || 0).toLocaleString()}</span><span class="white shadow">Beds Broken</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_three_final_kills_bedwars || 0) / (player?.stats?.Bedwars?.four_three_games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Finals per Game</span></a>
                    </div>
                    <div style="margin-top: 205px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_three_losses_bedwars || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_three_beds_lost_bedwars || 0).toLocaleString()}</span><span class="white shadow">Beds Lost</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_three_kills_bedwars || 0) / (player?.stats?.Bedwars?.four_three_games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Kills per Game</span></a>
                    </div>
                    <div style="margin-top: 235px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.four_three_wins_bedwars || 1, player?.stats?.Bedwars?.four_three_losses_bedwars || 1)}</span><span class="white shadow">WLR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.four_three_beds_broken_bedwars || 1, player?.stats?.Bedwars?.four_three_beds_lost_bedwars || 1)}</span><span class="white shadow">BBLR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_three_beds_broken_bedwars || 0) / (player?.stats?.Bedwars?.four_three_games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Beds per Game</span></a>
                    </div>
                    <div style="margin-top: 305px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_three_final_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Final Kills</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_three_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_three_void_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Void Kills</span></a>
                    </div>
                    <div style="margin-top: 335px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_three_final_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Final Deaths</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_three_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_three_void_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Void Deaths</span></a>
                    </div>
                    <div style="margin-top: 365px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.four_three_final_kills_bedwars || 1, player?.stats?.Bedwars?.four_three_final_deaths_bedwars || 1)}</span><span class="white shadow">FKDR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.four_three_kills_bedwars || 1, player?.stats?.Bedwars?.four_three_deaths_bedwars || 1)}</span><span class="white shadow">KDR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.four_three_void_kills_bedwars || 1, player?.stats?.Bedwars?.four_three_void_deaths_bedwars || 1)}</span><span class="white shadow">VKDR</span></a>
                    </div>
                      </div>
                      <div class="bw-display content-center" style="visibility:hidden;" id="bw_four">
                      <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/nwCIHft.png">
                      <div class="bwimgtt" style="margin-top:12px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1>${this.mcColorParser(this.getLevelFormatted(player?.achievements?.bedwars_level || 0))} ${displayName} ${gcolor}</h1></a></div>
                      <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getBwMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                        <div class="bwimgtt" style="margin-top: 440px;">
                      <a id="bwbartnl">
                        <span style="font-size:23px;font-weight:bold;"class="dark_gray shadow">[</span>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <span style="font-size:23px;font-weight:bold;"class="dark_gray shadow">]</span>
                     </a>
                     <span style="font-size:15.5px;font-family:Minecraftia;margin-left: 5px;" class="aqua shadow">${this.getBwPrecentToNextLevel(player?.stats?.Bedwars?.Experience || 0)}%</span>
                        </div>
                    <div class="bwimgbottom">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_four_winstreak || 0).toLocaleString()}</span><span class="white shadow">Winstreak</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    </div>
                    <div style="margin-top: 175px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_four_wins_bedwars || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_four_beds_broken_bedwars || 0).toLocaleString()}</span><span class="white shadow">Beds Broken</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_four_final_kills_bedwars || 0) / (player?.stats?.Bedwars?.four_four_games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Finals per Game</span></a>
                    </div>
                    <div style="margin-top: 205px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_four_losses_bedwars || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_four_beds_lost_bedwars || 0).toLocaleString()}</span><span class="white shadow">Beds Lost</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_four_kills_bedwars || 0) / (player?.stats?.Bedwars?.four_four_games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Kills per Game</span></a>
                    </div>
                    <div style="margin-top: 235px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.four_four_wins_bedwars || 1, player?.stats?.Bedwars?.four_four_losses_bedwars || 1)}</span><span class="white shadow">WLR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.four_four_beds_broken_bedwars || 1, player?.stats?.Bedwars?.four_four_beds_lost_bedwars || 1)}</span><span class="white shadow">BBLR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.four_four_beds_broken_bedwars || 0) / (player?.stats?.Bedwars?.four_four_games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Beds per Game</span></a>
                    </div>
                    <div style="margin-top: 305px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_four_final_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Final Kills</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_four_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_four_void_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Void Kills</span></a>
                    </div>
                    <div style="margin-top: 335px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_four_final_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Final Deaths</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_four_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.four_four_void_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Void Deaths</span></a>
                    </div>
                    <div style="margin-top: 365px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.four_four_final_kills_bedwars || 1, player?.stats?.Bedwars?.four_four_final_deaths_bedwars || 1)}</span><span class="white shadow">FKDR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.four_four_kills_bedwars || 1, player?.stats?.Bedwars?.four_four_deaths_bedwars || 1)}</span><span class="white shadow">KDR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.four_four_void_kills_bedwars || 1, player?.stats?.Bedwars?.four_four_void_deaths_bedwars || 1)}</span><span class="white shadow">VKDR</span></a>
                    </div>
                      </div>
                      <div class="bw-display content-center" style="visibility:hidden;" id="bw_4v4">
                      <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/jdfURji.png">
                      <div class="bwimgtt" style="margin-top:12px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1>${this.mcColorParser(this.getLevelFormatted(player?.achievements?.bedwars_level || 0))} ${displayName} ${gcolor}</h1></a></div>
                      <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getBwMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                        <div class="bwimgtt" style="margin-top: 440px;">
                      <a id="bwbartnl">
                        <span style="font-size:23px;font-weight:bold;"class="dark_gray shadow">[</span>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <div class="bwbar"></div>
                        <span style="font-size:23px;font-weight:bold;"class="dark_gray shadow">]</span>
                     </a>
                     <span style="font-size:15.5px;font-family:Minecraftia;margin-left: 5px;" class="aqua shadow">${this.getBwPrecentToNextLevel(player?.stats?.Bedwars?.Experience || 0)}%</span>
                        </div>
                    <div class="bwimgbottom">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.two_four_winstreak || 0).toLocaleString()}</span><span class="white shadow">Winstreak</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    </div>
                    <div style="margin-top: 175px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.two_four_wins_bedwars || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.two_four_beds_broken_bedwars || 0).toLocaleString()}</span><span class="white shadow">Beds Broken</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.two_four_final_kills_bedwars || 0) / (player?.stats?.Bedwars?.two_four_games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Finals per Game</span></a>
                    </div>
                    <div style="margin-top: 205px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.two_four_losses_bedwars || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.two_four_beds_lost_bedwars || 0).toLocaleString()}</span><span class="white shadow">Beds Lost</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.two_four_kills_bedwars || 0) / (player?.stats?.Bedwars?.two_four_games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Kills per Game</span></a>
                    </div>
                    <div style="margin-top: 235px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.two_four_wins_bedwars || 1, player?.stats?.Bedwars?.two_four_losses_bedwars || 1)}</span><span class="white shadow">WLR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.two_four_beds_broken_bedwars || 1, player?.stats?.Bedwars?.two_four_beds_lost_bedwars || 1)}</span><span class="white shadow">BBLR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Bedwars?.two_four_beds_broken_bedwars || 0) / (player?.stats?.Bedwars?.two_four_games_played_bedwars|| 0)).toFixed(2)}</span><span class="white shadow">Beds per Game</span></a>
                    </div>
                    <div style="margin-top: 305px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.two_four_final_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Final Kills</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.two_four_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.two_four_void_kills_bedwars || 0).toLocaleString()}</span><span class="white shadow">Void Kills</span></a>
                    </div>
                    <div style="margin-top: 335px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.two_four_final_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Final Deaths</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.two_four_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Bedwars?.two_four_void_deaths_bedwars || 0).toLocaleString()}</span><span class="white shadow">Void Deaths</span></a>
                    </div>
                    <div style="margin-top: 365px;" class="bwimgstats">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.two_four_final_kills_bedwars || 1, player?.stats?.Bedwars?.two_four_final_deaths_bedwars || 1)}</span><span class="white shadow">FKDR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.two_four_kills_bedwars || 1, player?.stats?.Bedwars?.two_four_deaths_bedwars || 1)}</span><span class="white shadow">KDR</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Bedwars?.two_four_void_kills_bedwars || 1, player?.stats?.Bedwars?.two_four_void_deaths_bedwars || 1)}</span><span class="white shadow">VKDR</span></a>
                    </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck6">
                  <label class="tab-label" for="chck6">Build Battle</label>
                  <div style="height: 474px;"class="tab-content">
                    <div class="content-center">
                      <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/OIOmLxg.png">
                      <div class="bwimgtt" style="margin-top:25px;font-size:20px;font-family:MinecraftiaRegular;"><a><span style="font-weight:bold;">${this.mcColorParser(this.buildBattleTitle(player?.stats?.BuildBattle?.score || 0, uuid))}</span><span> ${displayName} ${gcolor}</span></a></div>
                      <div class="bwimgtt" style="margin-top:110px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${(player?.stats?.BuildBattle?.score || 0).toLocaleString()}</span><span style="color:#F2F2F2">Score</span></a></div>
                        <div style="margin-top: 415px;" class="bbimgstats">
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.BuildBattle?.total_votes || 0).toLocaleString()}</span><span class="white shadow">Votes</span></a>
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.BuildBattle?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.BuildBattle?.super_votes || 0).toLocaleString()}</span><span class="white shadow">Super Votes</span></a>
                        </div>
                        <div style="margin-top: 185px;" class="bbimgstats">
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.BuildBattle?.wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.BuildBattle?.games_played || 0) - (player?.stats?.BuildBattle?.wins || 0)).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${(player?.stats?.BuildBattle?.correct_guesses || 0).toLocaleString()}</span><span class="white shadow">Guesses</span></a>
                        </div>
                        <div style="margin-top: 265px;" class="bbimgstats">
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.BuildBattle?.wins_solo_normal || 0).toLocaleString()}</span><span class="white shadow">Solo Wins</span></a>
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.BuildBattle?.wins_teams_normal || 0).toLocaleString()}</span><span class="white shadow">Team Wins</span></a>
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.BuildBattle?.wins_solo_pro || 0).toLocaleString()}</span><span class="white shadow">Pro Wins</span></a>
                        </div>
                        <div style="margin-top: 335px;" class="content-center">
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.BuildBattle?.wins_guess_the_build || 0).toLocaleString()}</span><span class="white shadow">Guess The Build Wins</span></a>
                        </div>
                    </div>
                  </div>
                </div>
               <div class="tab">
                  <button title="Display Kits" id="bsg-kitsb" class="bsg-button-top">&#10066;</button>
                  <input class="input56" type="checkbox" id="chck7">
                  <label class="tab-label" for="chck7">Blitz Survival Games</label>
                  <div style="height: 474px;"class="tab-content">
                      <div class="bsg-display content-center" style="visibility:hidden;" id="bsg_kits">
                        <div id="kits_body">
                      </div>
                    </div>
                    <div id="bsg-statss" style="" class="content-center">
                      <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/hoCh0Pm.png">
                      <div class="bwimgtt" style="margin-top:16px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1>${this.mcColorParser(this.getBlitzKillCounter(player?.stats?.HungerGames?.kills || 0))} ${displayName} ${gcolor}</h1></a></div>
                      <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px;text-shadow: 1px 1px 1px black;">${this.getBlitzMainMode()}</span><span class="white shadow">Main Mode</span></a></div>
                      <div class="bwimgtt" style="margin-top:125px;font-size:18px;font-family:MinecraftiaRegular;"><a><span class="yellow shadow" style="margin-right:10px;text-shadow: 1px 1px 1px black;">${this.getBlitzTotalKits()}</span><span class="white shadow">Kits</span></a></div>
                      <div style="margin-top: 440px;" class="bsgimgstats3">
                        <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.HungerGames?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                        <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.HungerGames?.defaultkit || 0).toLocaleString()}</span><span class="white shadow">Default Kit</span></a>
                        <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.HungerGames?.chests_opened || 0).toLocaleString()}</span><span class="white shadow">Chests Opened</span></a>
                      </div>
                    <div style="margin-top: 190px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.HungerGames?.wins_solo_normal || 0) + (player?.stats?.HungerGames?.wins_teams_normal || 0)).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.HungerGames?.kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    </div>
                    <div style="margin-top: 225px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.HungerGames?.games_played || 0) - ((player?.stats?.HungerGames?.wins_solo_normal || 0) + (player?.stats?.HungerGames?.wins_teams_normal || 0))).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.HungerGames?.deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    </div>
                    <div style="margin-top: 255px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(((player?.stats?.HungerGames?.wins_solo_normal || 0) + (player?.stats?.HungerGames?.wins_teams_normal || 0)), ((player?.stats?.HungerGames?.games_played || 0) - ((player?.stats?.HungerGames?.wins_solo_normal || 0) + (player?.stats?.HungerGames?.wins_teams_normal || 0))))}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio((player?.stats?.HungerGames?.kills || 0), (player?.stats?.HungerGames?.deaths || 0))}</span><span class="white shadow">KDR</span></a>
                    </div>
                    <div style="margin-top: 330px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.HungerGames?.wins_solo_normal || 0).toLocaleString()}</span><span class="white shadow">Solo Wins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.HungerGames?.wins_teams_normal || 0).toLocaleString()}</span><span class="white shadow">Team Wins</span></a>
                    </div>
                    <div style="margin-top: 365px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.HungerGames?.kills_solo_normal || 0).toLocaleString()}</span><span class="white shadow">Solo Kills</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.HungerGames?.kills_teams_normal || 0).toLocaleString()}</span><span class="white shadow">Team Kills</span></a>
                    </div>
                    </div>
                  </div>
                </div>
               <div class="tab">
                  <input class="input56" type="checkbox" id="chck8">
                  <label class="tab-label" for="chck8">Cops and Crims</label>
                  <div style="height:532px;" class="tab-content">
                  <div style="margin-bottom:15px;" class="content-center">
                    <button id="cvc-defb" class="cvc-button-top">Defusal</button>
                    <button id="cvc-tdmb" class="cvc-button-top">Death Match</button>
                  </div>
                  <div class="cvc-display content-center" style="" id="cvc_def">
                  <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/o61vDfx.png">
                  <div class="bwimgtt" style="margin-top:90px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getCvcMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                  <div style="margin-top: 430px;" class="bsgimgstats3">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MCGO?.bombs_defused || 0).toLocaleString()}</span><span class="white shadow">Bombs Defused</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MCGO?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MCGO?.bombs_planted || 0).toLocaleString()}</span><span class="white shadow">Bombs Planted</span></a>
                  </div>
                  <div style="margin-top: 170px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MCGO?.game_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MCGO?.kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                  </div>
                  <div style="margin-top: 205px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.MCGO?.game_plays || 0) - (player?.stats?.MCGO?.game_wins || 0)).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.MCGO?.deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    </div>
                  <div style="margin-top: 240px;" class="bsgimgstats2">
                    <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio((player?.stats?.MCGO?.game_wins || 0), ((player?.stats?.MCGO?.game_plays || 0) - (player?.stats?.MCGO?.game_wins || 0)))}</span><span class="white shadow">WLR</span></a>
                    <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio((player?.stats?.MCGO?.kills || 0), (player?.stats?.MCGO?.deaths || 0))}</span><span class="white shadow">KDR</span></a>
                  </div>
                  <div style="margin-top: 320px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MCGO?.cop_kills || 0).toLocaleString()}</span><span class="white shadow">Cop Kills</span></a>
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MCGO?.headshot_kills || 0).toLocaleString()}</span><span class="white shadow">Head Shots</span></a>
                  </div>
                  <div style="margin-top: 360px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MCGO?.criminal_kills || 0).toLocaleString()}</span><span class="white shadow">Crim Kills</span></a>
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MCGO?.shots_fired || 0).toLocaleString()}</span><span class="white shadow">Shots</span></a>
                  </div>
                  </div>
                  <div class="cvc-display content-center" style="visibility:hidden;" id="cvc_tdm">
                  <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/DWlWCxm.png">
                  <div class="bwimgtt" style="margin-top:90px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getCvcMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                  <div style="margin-top: 430px;" class="bsgimgstats3">
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MCGO?.bombs_defused || 0).toLocaleString()}</span><span class="white shadow">Bombs Defused</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MCGO?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    <a class="nowrap" style="font-size:15px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MCGO?.bombs_planted || 0).toLocaleString()}</span><span class="white shadow">Bombs Planted</span></a>
                  </div>
                  <div style="margin-top: 170px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MCGO?.game_wins_deathmatch || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MCGO?.kills_deathmatch || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                  </div>
                  <div style="margin-top: 205px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.MCGO?.game_plays_deathmatch || 0) - (player?.stats?.MCGO?.game_wins_deathmatch || 0)).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.MCGO?.deaths_deathmatch || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    </div>
                  <div style="margin-top: 240px;" class="bsgimgstats2">
                    <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio((player?.stats?.MCGO?.game_wins_deathmatch || 0), ((player?.stats?.MCGO?.game_plays_deathmatch || 0) - (player?.stats?.MCGO?.game_wins_deathmatch || 0)))}</span><span class="white shadow">WLR</span></a>
                    <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio((player?.stats?.MCGO?.kills_deathmatch || 0), (player?.stats?.MCGO?.deaths_deathmatch || 0))}</span><span class="white shadow">KDR</span></a>
                  </div>
                  <div style="margin-top: 335px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MCGO?.cop_kills_deathmatch || 0).toLocaleString()}</span><span class="white shadow">Cop Kills</span></a>
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MCGO?.criminal_kills_deathmatch || 0).toLocaleString()}</span><span class="white shadow">Crim Kills</span></a>
                  </div>
                  </div>
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck9">
                  <label class="tab-label" for="chck9">Duels</label>
                  <div id="duel-tabcontent" style="height:532px;" class="tab-content">
                  <div style="margin-bottom:15px;" class="content-center">
                    <button id="duel-overallb" class="duels-button-top">Overall</button>
                    <button id="duel-allb" class="duels-button-top">All</button>
                  </div>
                    <div class="duels-display content-center" style="" id="duel_overall">
                    <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/mQrnN77.png">
                    <div class="bwimgtt" style="margin-top:16px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1>${this.mcColorParser(this.getDuelsTitle(player?.stats?.Duels?.wins || 0))} ${displayName} ${gcolor}</h1></a></div>
                    <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px;text-shadow: 1px 1px 1px black;">${this.getDuelsMainMode()}</span><span class="white shadow">Main Mode</span></a></div>
                      <div style="margin-top: 440px;" class="bsgimgstats3">
                        <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak || 0).toLocaleString()}</span><span class="white shadow">Current Winstreak</span></a>
                        <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                        <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_overall_winstreak || 0).toLocaleString()}</span><span class="white shadow">Best Winstreak</span></a>
                      </div>
                    <div style="margin-top: 160px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    </div>
                    <div style="margin-top: 190px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    </div>
                    <div style="margin-top: 220px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio((player?.stats?.Duels?.wins || 0), (player?.stats?.Duels?.losses || 0))}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio((player?.stats?.Duels?.kills || 0), (player?.stats?.Duels?.losses || 0))}</span><span class="white shadow">KDR</span></a>
                    </div>
                    <div style="margin-top: 310px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.melee_hits || 0).toLocaleString()}</span><span class="white shadow">Hits</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.bow_hits || 0).toLocaleString()}</span><span class="white shadow">Bow Hits</span></a>
                    </div>
                    <div style="margin-top: 340px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.melee_swings || 0).toLocaleString()}</span><span class="white shadow">Swings</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.bow_shots || 0).toLocaleString()}</span><span class="white shadow">Bow Shots</span></a>
                    </div>
                    <div style="margin-top: 370px;" class="bsgimgstats2">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${(((player?.stats?.Duels?.melee_hits || 0) / (player?.stats?.Duels?.melee_swings || 0)) * 100).toFixed(2)}%</span><span class="white shadow">Accuracy</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${(((player?.stats?.Duels?.bow_hits || 0) / (player?.stats?.Duels?.bow_shots || 0)) * 100).toFixed(2)}%</span><span class="white shadow">Accuracy</span></a>
                    </div>
                    </div>
                    <div class="duels-display content-center" style="visibility:hidden;" id="duel_all">
                    <div>
                      <div class="arcade_table">
                        <div style="background-image: url(https://i.imgur.com/SRGDs2z.png);" class="arcade_package">
                          <h1 class="duels-header">UHC Solo</h1>
                          <div class="content-center">
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.uhc_duel_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.uhc_duel_kills  || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.uhc_duel_losses  || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.uhc_duel_deaths  || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.uhc_duel_wins || 0, player?.stats?.Duels?.uhc_duel_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.uhc_duel_kills  || 0, player?.stats?.Duels?.uhc_duel_deaths  || 0) } KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_uhc_winstreak || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_uhc_winstreak  || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                        <div style="background-image: url(https://i.imgur.com/SRGDs2z.png);" class="arcade_package">
                          <h1 class="duels-header">UHC Doubles</h1>
                          <div class="content-center">
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.uhc_doubles_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.uhc_doubles_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.uhc_doubles_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.uhc_doubles_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.uhc_doubles_wins || 0, player?.stats?.Duels?.uhc_doubles_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.uhc_doubles_kills || 0, player?.stats?.Duels?.uhc_doubles_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_uhc_doubles || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_uhc_doubles || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                        <div style="background-image: url(https://i.imgur.com/SRGDs2z.png);" class="arcade_package">
                          <h1 class="duels-header">UHC Fours</h1>
                          <div class="content-center">
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.uhc_four_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.uhc_four_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.uhc_four_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.uhc_four_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.uhc_four_wins || 0, player?.stats?.Duels?.uhc_four_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.uhc_four_kills || 0, player?.stats?.Duels?.uhc_four_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_uhc_four || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_uhc_four || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                        <div style="background-image: url(https://i.imgur.com/SRGDs2z.png);" class="arcade_package">
                          <h1 class="duels-header">UHC Meetup</h1>
                          <div class="content-center">
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.uhc_meetup_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.uhc_meetup_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.uhc_meetup_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.uhc_meetup_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.uhc_meetup_wins || 0, player?.stats?.Duels?.uhc_meetup_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.uhc_meetup_kills || 0, player?.stats?.Duels?.uhc_meetup_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_uhc_meetup || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_uhc_meetup || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style="margin-top: 523px;position: absolute;">
                    <div class="arcade_table">
                     <div style="background-image: url(https://i.imgur.com/SRGDs2z.png);" class="arcade_package">
                        <h1 class="duels-header">UHC Overall</h1>
                        <div class="content-center">
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Duels?.uhc_duel_wins || 0) + (player?.stats?.Duels?.uhc_doubles_wins || 0) + (player?.stats?.Duels?.uhc_four_wins || 0) + (player?.stats?.Duels?.uhc_meetup_wins || 0)).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Duels?.uhc_duel_kills || 0) + (player?.stats?.Duels?.uhc_doubles_kills || 0) + (player?.stats?.Duels?.uhc_four_kills || 0) + (player?.stats?.Duels?.uhc_meetup_kills || 0)).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Duels?.uhc_duel_losses || 0) + (player?.stats?.Duels?.uhc_doubles_losses || 0) + (player?.stats?.Duels?.uhc_four_losses || 0) + (player?.stats?.Duels?.uhc_meetup_losses || 0)).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Duels?.uhc_duel_deaths || 0) + (player?.stats?.Duels?.uhc_doubles_deaths || 0) + (player?.stats?.Duels?.uhc_four_deaths || 0) + (player?.stats?.Duels?.uhc_meetup_deaths || 0)).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(((player?.stats?.Duels?.uhc_duel_wins || 0) + (player?.stats?.Duels?.uhc_doubles_wins || 0) + (player?.stats?.Duels?.uhc_four_wins || 0) + (player?.stats?.Duels?.uhc_meetup_wins || 0)), ((player?.stats?.Duels?.uhc_duel_losses || 0) + (player?.stats?.Duels?.uhc_doubles_losses || 0) + (player?.stats?.Duels?.uhc_four_losses || 0) + (player?.stats?.Duels?.uhc_meetup_losses || 0)))} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(((player?.stats?.Duels?.uhc_duel_kills || 0) + (player?.stats?.Duels?.uhc_doubles_kills || 0) + (player?.stats?.Duels?.uhc_four_kills || 0) + (player?.stats?.Duels?.uhc_meetup_kills || 0)), ((player?.stats?.Duels?.uhc_duel_deaths || 0) + (player?.stats?.Duels?.uhc_doubles_deaths || 0) + (player?.stats?.Duels?.uhc_four_deaths || 0) + (player?.stats?.Duels?.uhc_meetup_deaths || 0)))} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Duels?.current_winstreak_mode_uhc_duel || 0) + (player?.stats?.Duels?.current_winstreak_mode_uhc_doubles || 0) + (player?.stats?.Duels?.current_winstreak_mode_uhc_four || 0) + (player?.stats?.Duels?.current_winstreak_mode_uhc_meetup || 0)).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Duels?.best_winstreak_mode_uhc_duel || 0) + (player?.stats?.Duels?.best_winstreak_mode_uhc_doubles || 0) + (player?.stats?.Duels?.best_winstreak_mode_uhc_four || 0) + (player?.stats?.Duels?.best_winstreak_mode_uhc_meetup || 0)).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                      </div>
                  </div>
                  </div>
                  <div style="margin-top: 837px;position: absolute;">
                      <div class="arcade_table">
                        <div style="background-image: url(https://i.imgur.com/GNfH2LB.png;" class="arcade_package">
                          <h1 class="duels-header">Bridge Solo</h1>
                          <div class="content-center">
                          <div style="margin-top:-85px"><a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span style="margin-right:10px;color:#93d2f2;">${(player?.stats?.Duels?.bridge_duel_goals || 0).toLocaleString()}</span><span class="white shadow">Goals</span></a></div>
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_duel_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_duel_bridge_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_duel_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_duel_bridge_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.bridge_duel_wins || 0, player?.stats?.Duels?.bridge_duel_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.bridge_duel_bridge_kills || 0, player?.stats?.Duels?.bridge_duel_bridge_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_bridge_duel || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_bridge_duel || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                        <div style="background-image: url(https://i.imgur.com/GNfH2LB.png;" class="arcade_package">
                          <h1 class="duels-header">Bridge Doubles</h1>
                          <div class="content-center">
                          <div style="margin-top:-85px"><a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span style="margin-right:10px;color:#93d2f2;">${(player?.stats?.Duels?.bridge_doubles_goals || 0).toLocaleString()}</span><span class="white shadow">Goals</span></a></div>
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_doubles_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_doubles_bridge_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_doubles_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_doubles_bridge_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.bridge_doubles_wins || 0, player?.stats?.Duels?.bridge_doubles_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.bridge_doubles_bridge_kills || 0, player?.stats?.Duels?.bridge_doubles_bridge_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_bridge_doubles || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_bridge_doubles || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                        <div style="background-image: url(https://i.imgur.com/GNfH2LB.png;" class="arcade_package">
                          <h1 class="duels-header">Bridge Fours</h1>
                          <div class="content-center">
                          <div style="margin-top:-85px"><a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span style="margin-right:10px;color:#93d2f2;">${(player?.stats?.Duels?.bridge_four_goals || 0).toLocaleString()}</span><span class="white shadow">Goals</span></a></div>
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_four_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_four_bridge_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_four_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_four_bridge_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.bridge_four_wins || 0, player?.stats?.Duels?.bridge_four_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.bridge_four_bridge_kills || 0, player?.stats?.Duels?.bridge_four_bridge_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_bridge_four || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_bridge_four || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                        <div style="background-image: url(https://i.imgur.com/GNfH2LB.png;" class="arcade_package">
                          <h1 class="duels-header">Bridge 2v2v2v2</h1>
                          <div class="content-center">
                          <div style="margin-top:-85px"><a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span style="margin-right:10px;color:#93d2f2;">${(player?.stats?.Duels?.bridge_2v2v2v2_goals || 0).toLocaleString()}</span><span class="white shadow">Goals</span></a></div>
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_2v2v2v2_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_2v2v2v2_bridge_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_2v2v2v2_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_2v2v2v2_bridge_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.bridge_2v2v2v2_wins || 0, player?.stats?.Duels?.bridge_2v2v2v2_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.bridge_2v2v2v2_bridge_kills || 0, player?.stats?.Duels?.bridge_2v2v2v2_bridge_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_bridge_2v2v2v2 || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_bridge_2v2v2v2 || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style="margin-top: 1363px;position: absolute;">
                    <div class="arcade_table">
                     <div style="background-image: url(https://i.imgur.com/GNfH2LB.png;" class="arcade_package">
                        <h1 class="duels-header">Bridge 3v3v3v3</h1>
                        <div class="content-center">
                        <div style="margin-top:-85px"><a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span style="margin-right:10px;color:#93d2f2;">${(player?.stats?.Duels?.bridge_3v3v3v3_goals || 0).toLocaleString()}</span><span class="white shadow">Goals</span></a></div>
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_3v3v3v3_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_3v3v3v3_bridge_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_3v3v3v3_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.bridge_3v3v3v3_bridge_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.bridge_3v3v3v3_wins || 0, player?.stats?.Duels?.bridge_3v3v3v3_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.bridge_3v3v3v3_bridge_kills || 0, player?.stats?.Duels?.bridge_3v3v3v3_bridge_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_bridge_3v3v3v3 || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_bridge_3v3v3v3 || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                      </div>
                      <div style="background-image: url(https://i.imgur.com/GNfH2LB.png;" class="arcade_package">
                        <h1 class="duels-header">Bridge Overall</h1>
                        <div class="content-center">
                        <div style="margin-top:-85px"><a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span style="margin-right:10px;color:#93d2f2;">${((player?.stats?.Duels?.bridge_duel_goals || 0) + (player?.stats?.Duels?.bridge_doubles_goals || 0) + (player?.stats?.Duels?.bridge_four_goals || 0) + (player?.stats?.Duels?.bridge_2v2v2v2_goals || 0) + (player?.stats?.Duels?.bridge_3v3v3v3_goals || 0)).toLocaleString()}</span><span class="white shadow">Goals</span></a></div>
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Duels?.bridge_duel_wins || 0) + (player?.stats?.Duels?.bridge_doubles_wins || 0) + (player?.stats?.Duels?.bridge_four_wins || 0) + (player?.stats?.Duels?.bridge_2v2v2v2_wins || 0) + (player?.stats?.Duels?.bridge_3v3v3v3_wins || 0)).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Duels?.bridge_duel_bridge_kills || 0) + (player?.stats?.Duels?.bridge_doubles_bridge_kills || 0) + (player?.stats?.Duels?.bridge_four_bridge_kills || 0) + (player?.stats?.Duels?.bridge_2v2v2v2_bridge_kills || 0) + (player?.stats?.Duels?.bridge_3v3v3v3_bridge_kills || 0)).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Duels?.bridge_duel_losses || 0) + (player?.stats?.Duels?.bridge_doubles_losses || 0) + (player?.stats?.Duels?.bridge_four_losses || 0) + (player?.stats?.Duels?.bridge_2v2v2v2_losses || 0) + (player?.stats?.Duels?.bridge_3v3v3v3_losses || 0)).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Duels?.bridge_duel_bridge_deaths || 0) + (player?.stats?.Duels?.bridge_doubles_bridge_deaths || 0) + (player?.stats?.Duels?.bridge_four_bridge_deaths || 0) + (player?.stats?.Duels?.bridge_2v2v2v2_bridge_deaths || 0) + (player?.stats?.Duels?.bridge_3v3v3v3_bridge_deaths || 0)).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(((player?.stats?.Duels?.bridge_duel_wins || 0) + (player?.stats?.Duels?.bridge_doubles_wins || 0) + (player?.stats?.Duels?.bridge_four_wins || 0) + (player?.stats?.Duels?.bridge_2v2v2v2_wins || 0) + (player?.stats?.Duels?.bridge_3v3v3v3_wins || 0)), ((player?.stats?.Duels?.bridge_duel_losses || 0) + (player?.stats?.Duels?.bridge_doubles_losses || 0) + (player?.stats?.Duels?.bridge_four_losses || 0) + (player?.stats?.Duels?.bridge_2v2v2v2_losses || 0) + (player?.stats?.Duels?.bridge_3v3v3v3_losses || 0)))} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(((player?.stats?.Duels?.bridge_duel_bridge_kills || 0) + (player?.stats?.Duels?.bridge_doubles_bridge_kills || 0) + (player?.stats?.Duels?.bridge_four_bridge_kills || 0) + (player?.stats?.Duels?.bridge_2v2v2v2_bridge_kills || 0) + (player?.stats?.Duels?.bridge_3v3v3v3_bridge_kills || 0)), ((player?.stats?.Duels?.bridge_duel_bridge_deaths || 0) + (player?.stats?.Duels?.bridge_doubles_bridge_deaths || 0) + (player?.stats?.Duels?.bridge_four_bridge_deaths || 0) + (player?.stats?.Duels?.bridge_2v2v2v2_bridge_deaths || 0) + (player?.stats?.Duels?.bridge_3v3v3v3_bridge_deaths || 0)))} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Duels?.current_winstreak_mode_bridge_duel || 0) + (player?.stats?.Duels?.current_winstreak_mode_bridge_doubles || 0) + (player?.stats?.Duels?.current_winstreak_mode_bridge_four || 0) + (player?.stats?.Duels?.current_winstreak_mode_bridge_2v2v2v2 || 0) + (player?.stats?.Duels?.current_winstreak_mode_bridge_3v3v3v3 || 0)).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Duels?.best_winstreak_mode_bridge_duel || 0) + (player?.stats?.Duels?.best_winstreak_mode_bridge_doubles || 0) + (player?.stats?.Duels?.best_winstreak_mode_bridge_four || 0) + (player?.stats?.Duels?.best_winstreak_mode_bridge_2v2v2v2 || 0) + (player?.stats?.Duels?.best_winstreak_mode_bridge_3v3v3v3 || 0)).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                      </div>
                  </div>
                  </div>
                  <div style="margin-top: 1677px;position: absolute;">
                      <div class="arcade_table">
                        <div style="background-image: url(https://i.imgur.com/rwWgOg0.png;" class="arcade_package">
                          <h1 class="duels-header">Op Solo</h1>
                          <div class="content-center">
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.op_duel_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.op_duel_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.op_duel_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.op_duel_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.op_duel_wins || 0, player?.stats?.Duels?.op_duel_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.op_duel_kills|| 0, player?.stats?.Duels?.op_duel_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_op_duel || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_op_duel || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                        <div style="background-image: url(https://i.imgur.com/rwWgOg0.png;" class="arcade_package">
                          <h1 class="duels-header">Op Doubles</h1>
                          <div class="content-center">
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.op_doubles_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.op_doubles_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.op_doubles_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.op_doubles_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.op_doubles_wins || 0, player?.stats?.Duels?.op_doubles_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.op_doubles_kills || 0, player?.stats?.Duels?.op_doubles_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_op_doubles || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_op_doubles || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style="margin-top: 1943px;position: absolute;">
                    <div class="arcade_table">
                     <div style="background-image: url(https://i.imgur.com/rwWgOg0.png;" class="arcade_package">
                        <h1 class="duels-header">Op Overall</h1>
                        <div class="content-center">
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Duels?.op_duel_wins || 0) + (player?.stats?.Duels?.op_doubles_wins || 0)).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Duels?.op_duel_kills || 0) + (player?.stats?.Duels?.op_doubles_kills || 0)).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Duels?.op_duel_losses || 0) + (player?.stats?.Duels?.op_doubles_losses || 0)).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Duels?.op_duel_deaths || 0) + (player?.stats?.Duels?.op_doubles_deaths || 0)).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(((player?.stats?.Duels?.op_duel_wins || 0) + (player?.stats?.Duels?.op_doubles_wins || 0)), ((player?.stats?.Duels?.op_duel_losses || 0) + (player?.stats?.Duels?.op_doubles_losses || 0)))} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(((player?.stats?.Duels?.op_duel_kills || 0) + (player?.stats?.Duels?.op_doubles_kills || 0)), ((player?.stats?.Duels?.op_duel_deaths || 0) + (player?.stats?.Duels?.op_doubles_deaths || 0)))} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Duels?.current_winstreak_mode_op_duel || 0) + (player?.stats?.Duels?.current_winstreak_mode_op_doubles || 0)).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Duels?.best_winstreak_mode_op_duel || 0) + (player?.stats?.Duels?.best_winstreak_mode_op_doubles || 0)).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                      </div>
                  </div>
                  </div>
                  <div style="margin-top: 2253px;position: absolute;">
                      <div class="arcade_table">
                        <div style="background-image: url(https://i.imgur.com/3nvY4vF.png" class="arcade_package">
                          <h1 class="duels-header">SkyWars Solo</h1>
                          <div class="content-center">
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.sw_duel_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.sw_duel_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.sw_duel_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.sw_duel_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.sw_duel_wins || 0, player?.stats?.Duels?.sw_duel_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.sw_duel_kills || 0, player?.stats?.Duels?.sw_duel_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_sw_duel || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_sw_duel || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                        <div style="background-image: url(https://i.imgur.com/3nvY4vF.png" class="arcade_package">
                          <h1 class="duels-header">SkyWars Doubles</h1>
                          <div class="content-center">
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.sw_doubles_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.sw_doubles_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.sw_doubles_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.sw_doubles_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.sw_doubles_wins || 0, player?.stats?.Duels?.sw_doubles_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.sw_doubles_kills || 0, player?.stats?.Duels?.sw_doubles_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_sw_doubles || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_sw_doubles || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style="margin-top: 2523px;position: absolute;">
                    <div class="arcade_table">
                     <div style="background-image: url(https://i.imgur.com/3nvY4vF.png" class="arcade_package">
                        <h1 class="duels-header">SkyWars Overall</h1>
                        <div class="content-center">
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Duels?.sw_duel_wins || 0) + (player?.stats?.Duels?.sw_doubles_wins || 0)).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Duels?.sw_duel_kills || 0) + (player?.stats?.Duels?.sw_doubles_kills || 0)).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Duels?.sw_duel_losses || 0) + (player?.stats?.Duels?.sw_doubles_losses || 0)).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Duels?.sw_duel_deaths || 0) + (player?.stats?.Duels?.sw_doubles_deaths || 0)).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(((player?.stats?.Duels?.sw_duel_wins || 0) + (player?.stats?.Duels?.sw_doubles_wins || 0)), ((player?.stats?.Duels?.sw_duel_losses || 0) + (player?.stats?.Duels?.sw_doubles_losses || 0)))} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(((player?.stats?.Duels?.sw_duel_kills || 0) + (player?.stats?.Duels?.sw_doubles_kills || 0)), ((player?.stats?.Duels?.sw_duel_deaths || 0) + (player?.stats?.Duels?.sw_doubles_deaths || 0)))} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Duels?.current_winstreak_mode_sw_duel || 0) + (player?.stats?.Duels?.current_winstreak_mode_sw_doubles || 0)).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Duels?.best_winstreak_mode_sw_duel || 0) + (player?.stats?.Duels?.best_winstreak_mode_sw_doubles || 0)).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                      </div>
                  </div>
                  </div>
                  <div style="margin-top: 2833px;position: absolute;">
                      <div class="arcade_table">
                        <div style="background-image: url(https://i.imgur.com/3eXJnBB.png" class="arcade_package">
                          <h1 class="duels-header">Mega Walls Solo</h1>
                          <div class="content-center">
                          <div style="margin-top:-85px"><a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span style="margin-right:10px;color:#93d2f2;">${(player?.stats?.Duels?.mw_duels_class || "Unset")}</span><span class="white shadow">Class</span></a></div>
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.mw_duel_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.mw_duel_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.mw_duel_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.mw_duel_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.mw_duel_wins || 0, player?.stats?.Duels?.mw_duel_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.mw_duel_kills || 0, player?.stats?.Duels?.mw_duel_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_mw_duel || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_mw_duel || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                        <div style="background-image: url(https://i.imgur.com/3eXJnBB.png" class="arcade_package">
                          <h1 class="duels-header">Mega Walls Doubles</h1>
                          <div class="content-center">
                          <div style="margin-top:-85px"><a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span style="margin-right:10px;color:#93d2f2;">${(player?.stats?.Duels?.mw_duels_class || "Unset")}</span><span class="white shadow">Class</span></a></div>
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.mw_doubles_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.mw_doubles_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.mw_doubles_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.mw_doubles_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.mw_doubles_wins || 0, player?.stats?.Duels?.mw_doubles_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.mw_doubles_kills || 0, player?.stats?.Duels?.mw_doubles_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_mw_doubles || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_mw_doubles || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                  <div style="margin-top: 3103px;position: absolute;">
                  <div class="arcade_table">
                      <div style="background-image: url(https://i.imgur.com/3eXJnBB.png" class="arcade_package">
                        <h1 class="duels-header">Mega Walls Overall</h1>
                        <div class="content-center">
                          <div style="margin-top:-85px"><a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span style="margin-right:10px;color:#93d2f2;">${(player?.stats?.Duels?.mw_duels_class || "Unset")}</span><span class="white shadow">Class</span></a></div>
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Duels?.mw_duel_wins || 0) + (player?.stats?.Duels?.mw_doubles_wins || 0)).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Duels?.mw_duel_kills || 0) + (player?.stats?.Duels?.mw_doubles_kills || 0)).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Duels?.mw_duel_losses || 0) + (player?.stats?.Duels?.mw_doubles_losses || 0)).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Duels?.mw_duel_deaths || 0) + (player?.stats?.Duels?.mw_doubles_deaths|| 0)).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(((player?.stats?.Duels?.mw_duel_wins || 0) + (player?.stats?.Duels?.mw_doubles_wins || 0)), ((player?.stats?.Duels?.mw_duel_losses || 0) + (player?.stats?.Duels?.mw_doubles_losses || 0)))} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(((player?.stats?.Duels?.mw_duel_kills || 0) + (player?.stats?.Duels?.mw_doubles_kills || 0)), ((player?.stats?.Duels?.mw_duel_deaths || 0) + (player?.stats?.Duels?.mw_doubles_deaths|| 0)))} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Duels?.current_winstreak_mode_mw_duel || 0) + (player?.stats?.Duels?.current_winstreak_mode_mw_doubles || 0)).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Duels?.best_winstreak_mode_mw_duel || 0) + (player?.stats?.Duels?.best_winstreak_mode_mw_doubles || 0)).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                      </div>
                      </div>
                </div>
                </div>
                  <div style="margin-top: 3403px;position: absolute;">
                      <div class="arcade_table">
                        <div style="background-image: url(https://i.imgur.com/guEJ38p.png" class="arcade_package">
                          <h1 class="duels-header">Classic Solo</h1>
                          <div class="content-center">
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.classic_duel_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.classic_duel_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.classic_duel_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.classic_duel_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.classic_duel_wins || 0, player?.stats?.Duels?.classic_duel_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.classic_duel_kills || 0, player?.stats?.Duels?.classic_duel_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_classic_duel || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_classic_duel || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                        <div style="background-image: url(https://i.imgur.com/guEJ38p.png" class="arcade_package">
                          <h1 class="duels-header">Bow Solo</h1>
                          <div class="content-center">
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.bow_duel_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.bow_duel_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.bow_duel_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.bow_duel_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.bow_duel_wins || 0, player?.stats?.Duels?.bow_duel_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.bow_duel_kills || 0, player?.stats?.Duels?.bow_duel_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_bow_duel || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_bow_duel || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                  <div style="margin-top: 3683px;position: absolute;">
                      <div class="arcade_table">
                        <div style="background-image: url(https://i.imgur.com/sq4wZJa.png" class="arcade_package">
                          <h1 class="duels-header">NoDebuff Solo</h1>
                          <div class="content-center">
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.potion_duel_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.potion_duel_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.potion_duel_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.potion_duel_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.potion_duel_wins || 0, player?.stats?.Duels?.potion_duel_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.potion_duel_kills || 0, player?.stats?.Duels?.potion_duel_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_potion_duel || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_potion_duel || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                        <div style="background-image: url(https://i.imgur.com/sq4wZJa.png" class="arcade_package">
                          <h1 class="duels-header">Combo Solo</h1>
                          <div class="content-center">
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.combo_duel_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.combo_duel_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.combo_duel_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.combo_duel_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.combo_duel_wins || 0, player?.stats?.Duels?.combo_duel_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.combo_duel_kills || 0, player?.stats?.Duels?.combo_duel_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_combo_duel|| 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_combo_duel || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>

                  <div style="margin-top: 3963px;position: absolute;">
                      <div class="arcade_table">
                        <div style="background-image: url(https://i.imgur.com/2mpnMXL.png" class="arcade_package">
                          <h1 class="duels-header">Sumo Solo</h1>
                          <div class="content-center">
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.sumo_duel_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.sumo_duel_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.sumo_duel_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.sumo_duel_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.sumo_duel_wins || 0, player?.stats?.Duels?.sumo_duel_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.sumo_duel_kills || 0, player?.stats?.Duels?.sumo_duel_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_sumo_duel || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_sumo_duel || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                        <div style="background-image: url(https://i.imgur.com/K98fpZK.png" class="arcade_package">
                          <h1 class="duels-header">Blitz Solo</h1>
                          <div class="content-center">
                          <div style="margin-top:-85px"><a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span style="margin-right:10px;color:#93d2f2;">${(player?.stats?.Duels?.blitz_duels_kit || "Unset")}</span><span class="white shadow">Kit</span></a></div>
                            <div style="margin-top: -40px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.blitz_duel_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.blitz_duel_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                            </div>
                            <div style="margin-top: -20px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.blitz_duel_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.blitz_duel_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                            </div>
                            <div style="margin-top: 0px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.blitz_duel_wins || 0, player?.stats?.Duels?.blitz_duel_losses || 0)} WLR</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.blitz_duel_kills || 0, player?.stats?.Duels?.blitz_duel_deaths || 0)} KDR</span></a>
                            </div>
                            <div style="margin-top: 60px;" class="duelcards">
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_blitz_duel || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                              <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_blitz_duel || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>

                    <div style="margin-top: 4243px;position: absolute;">
                    <div class="arcade_table">
                        <div style="background-image: url(https://i.imgur.com/j4QgF5h.png" class="arcade_package">
                          <h1 class="duels-header">Bow Spleef Solo</h1>
                          <div class="content-center">
                          <div style="margin-top: -40px;" class="duelcards">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.bowspleef_duel_wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Duels?.bowspleef_duel_kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                        </div>
                        <div style="margin-top: -20px;" class="duelcards">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.bowspleef_duel_losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Duels?.bowspleef_duel_deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                        </div>
                        <div style="margin-top: 0px;" class="duelcards">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.bowspleef_duel_wins || 0, player?.stats?.Duels?.bowspleef_duel_losses || 0)} WLR</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Duels?.bowspleef_duel_kills || 0, player?.stats?.Duels?.bowspleef_duel_deaths || 0)} KDR</span></a>
                        </div>
                        <div style="margin-top: 60px;" class="duelcards">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.current_winstreak_mode_bowspleef_duel || 0).toLocaleString()}</span><span class="white shadow">Current Ws</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Duels?.best_winstreak_mode_bowspleef_duel || 0).toLocaleString()}</span><span class="white shadow">Best Ws</span></a>
                        </div>
                      </div>
                        </div>
                  </div>
                  </div>
                  </div>
                  </div>
                </div>
               <div class="tab">
                  <button title="Display Kits" id="mw-kitsb" class="bsg-button-top">&#10066;</button>
                  <input class="input56" type="checkbox" id="chck10">
                  <label class="tab-label" for="chck10">Mega Walls</label>
                  <div style="height: 474px;"class="tab-content">
                      <div class="mw-display content-center" style="visibility:hidden;" id="mw-kits">
                      <div>
                          <img style="transform: scale(1.2);" src="https://gen.plancke.io/mw/${uuid}/2.png">
                      </div>
                    </div>
                    <div id="mw-stats" style="" class="content-center">
                      <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/7xwS2n6.png">
                      <div class="bwimgtt" style="margin-top:90px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px;text-shadow: 1px 1px 1px black;">${(player?.stats?.Walls3?.chosen_class  || "Unset").toLocaleString()}</span><span class="white shadow">Class</span></a></div>
                      <div style="margin-top: 430px;" class="bsgimgstats3">
                        <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Walls3?.assists || 0).toLocaleString()}</span><span class="white shadow">Kill Assists</span></a>
                        <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Walls3?.coins  || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                        <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Walls3?.final_assists || 0).toLocaleString()}</span><span class="white shadow">Final Kill Assists</span></a>
                      </div>
                      <div style="margin-top: 160px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Walls3?.wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Walls3?.witherDamage || 0).toLocaleString()}</span><span class="white shadow">Wither Damage</span></a>
                      </div>
                      <div style="margin-top: 190px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Walls3?.losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Walls3?.defender_kills || 0).toLocaleString()}</span><span class="white shadow">Defender Kills</span></a>
                      </div>
                      <div style="margin-top: 220px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Walls3?.wins || 0, player?.stats?.Walls3?.losses || 0).toLocaleString()}</span><span class="white shadow">WLR</span></a>
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Walls3?.wither_kills || 0).toLocaleString()}</span><span class="white shadow">Wither Kills</span></a>
                      </div>
                      <div style="margin-top: 290px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Walls3?.kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Walls3?.final_kills || 0).toLocaleString()}</span><span class="white shadow">Final Kills</span></a>
                      </div>
                      <div style="margin-top: 320px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Walls3?.deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Walls3?.final_deaths || 0).toLocaleString()}</span><span class="white shadow">Final Deaths</span></a>
                      </div>
                      <div style="margin-top: 350px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Walls3?.kills || 0 , player?.stats?.Walls3?.deaths || 0).toLocaleString()}</span><span class="white shadow">KDR</span></a>
                        <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Walls3?.final_kills || 0, player?.stats?.Walls3?.final_deaths || 0).toLocaleString()}</span><span class="white shadow">FKDR</span></a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck11">
                  <label class="tab-label" for="chck11">Murder Mystery</label>
                  <div style="height: 532px;"class="tab-content">
                    <div style="margin-bottom:15px;" class="content-center">
                      <button id="mm-as" class="mm-button-top">Assasins</button>
                      <button id="mm-solo" class="mm-button-top">Classic Solo</button>
                      <button id="mm-overall" class="mm-button-top">Overall</button>
                      <button id="mm-double" class="mm-button-top">Classic Double Up</button>
                      <button id="mm-infection" class="mm-button-top">Infection v2</button>
                    </div>
                    <div class="mm-display content-center" style="visibility:hidden;" id="mm_as">
                      <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/n9z9cDb.png">
                      <div class="bwimgtt" style="margin-top:85px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getMmMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                      <div style="margin-top: 430px;" class="bsgimgstats3">
                        <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.was_hero_MURDER_ASSASSINS || 0).toLocaleString()}</span><span class="white shadow">Hero Wins</span></a>
                        <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.coins  || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                        <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.suicides_MURDER_ASSASSINS || 0).toLocaleString()}</span><span class="white shadow">Suicides</span></a>
                      </div>
                      <div style="margin-top: 190px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.wins_MURDER_ASSASSINS || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.kills_MURDER_ASSASSINS || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                      </div>
                      <div style="margin-top: 220px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.MurderMystery?.games_MURDER_ASSASSINS || 0) - (player?.stats?.MurderMystery?.wins_MURDER_ASSASSINS || 0)).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.deaths_MURDER_ASSASSINS || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                      </div>
                      <div style="margin-top: 250px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.MurderMystery?.wins_MURDER_ASSASSINS || 0, (player?.stats?.MurderMystery?.games_MURDER_ASSASSINS || 0) - (player?.stats?.MurderMystery?.wins_MURDER_ASSASSINS || 0))}</span><span class="white shadow">WLR</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.MurderMystery?.kills_MURDER_ASSASSINS || 0, player?.stats?.MurderMystery?.deaths_MURDER_ASSASSINS || 0)}</span><span class="white shadow">KDR</span></a>
                      </div>
                      <div style="margin-top: 320px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.knife_kills_MURDER_ASSASSINS || 0).toLocaleString()}</span><span class="white shadow">Knife Kills</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.bow_kills_MURDER_ASSASSINS || 0).toLocaleString()}</span><span class="white shadow">Bow Kills</span></a>
                      </div>
                      <div style="margin-top: 360px;position:absolute;" class="content-center"><a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.thrown_knife_kills_MURDER_ASSASSINS  || 0).toLocaleString()}</span><span class="white shadow">Knife Thrown Kills</span></a></div>
                    </div>
                    <div class="mm-display content-center" style="visibility:hidden;" id="mm_solo">
                      <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/YhlBi6B.png">
                      <div class="bwimgtt" style="margin-top:85px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getMmMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                      <div style="margin-top: 430px;" class="bsgimgstats3">
                        <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.was_hero_MURDER_CLASSIC || 0).toLocaleString()}</span><span class="white shadow">Hero Wins</span></a>
                        <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.coins  || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                        <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.suicides_MURDER_CLASSIC || 0).toLocaleString()}</span><span class="white shadow">Suicides</span></a>
                      </div>
                      <div style="margin-top: 190px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.wins_MURDER_CLASSIC || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.kills_MURDER_CLASSIC || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                      </div>
                      <div style="margin-top: 220px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.MurderMystery?.games_MURDER_CLASSIC || 0) - (player?.stats?.MurderMystery?.wins_MURDER_CLASSIC || 0)).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.deaths_MURDER_CLASSIC || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                      </div>
                      <div style="margin-top: 250px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.MurderMystery?.wins_MURDER_CLASSIC || 0, (player?.stats?.MurderMystery?.games_MURDER_CLASSIC || 0) - (player?.stats?.MurderMystery?.wins_MURDER_CLASSIC || 0))}</span><span class="white shadow">WLR</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.MurderMystery?.kills_MURDER_CLASSIC || 0, player?.stats?.MurderMystery?.deaths_MURDER_CLASSIC || 0)}</span><span class="white shadow">KDR</span></a>
                      </div>
                      <div style="margin-top: 320px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.knife_kills_MURDER_CLASSIC || 0).toLocaleString()}</span><span class="white shadow">Knife Kills</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.bow_kills_MURDER_CLASSIC || 0).toLocaleString()}</span><span class="white shadow">Bow Kills</span></a>
                      </div>
                      <div style="margin-top: 360px;position:absolute;" class="content-center"><a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.thrown_knife_kills_MURDER_CLASSIC  || 0).toLocaleString()}</span><span class="white shadow">Knife Thrown Kills</span></a></div>
                    </div>
                    <div class="mm-display content-center" style="" id="mm_overall">
                      <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/Z71iBgW.png">
                      <div class="bwimgtt" style="margin-top:85px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getMmMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                      <div style="margin-top: 430px;" class="bsgimgstats3">
                        <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.was_hero || 0).toLocaleString()}</span><span class="white shadow">Hero Wins</span></a>
                        <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.coins  || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                        <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.suicides || 0).toLocaleString()}</span><span class="white shadow">Suicides</span></a>
                      </div>
                      <div style="margin-top: 190px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                      </div>
                      <div style="margin-top: 220px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.MurderMystery?.games || 0) - (player?.stats?.MurderMystery?.wins || 0)).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                      </div>
                      <div style="margin-top: 250px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.MurderMystery?.wins || 0, (player?.stats?.MurderMystery?.games || 0) - (player?.stats?.MurderMystery?.wins || 0))}</span><span class="white shadow">WLR</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.MurderMystery?.kills || 0, player?.stats?.MurderMystery?.deaths || 0)}</span><span class="white shadow">KDR</span></a>
                      </div>
                      <div style="margin-top: 320px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.knife_kills || 0).toLocaleString()}</span><span class="white shadow">Knife Kills</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.bow_kills || 0).toLocaleString()}</span><span class="white shadow">Bow Kills</span></a>
                      </div>
                      <div style="margin-top: 360px;position:absolute;" class="content-center"><a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.thrown_knife_kills  || 0).toLocaleString()}</span><span class="white shadow">Knife Thrown Kills</span></a></div>
                    </div>
                    <div class="mm-display content-center" style="visibility:hidden;" id="mm_double">
                      <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/9KZ2fvQ.png">
                      <div class="bwimgtt" style="margin-top:85px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getMmMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                      <div style="margin-top: 430px;" class="bsgimgstats3">
                        <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.was_hero_MURDER_DOUBLE_UP || 0).toLocaleString()}</span><span class="white shadow">Hero Wins</span></a>
                        <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.coins  || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                        <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.suicides_MURDER_DOUBLE_UP || 0).toLocaleString()}</span><span class="white shadow">Suicides</span></a>
                      </div>
                      <div style="margin-top: 190px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.wins_MURDER_DOUBLE_UP || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.kills_MURDER_DOUBLE_UP || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                      </div>
                      <div style="margin-top: 220px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.MurderMystery?.games_MURDER_DOUBLE_UP || 0) - (player?.stats?.MurderMystery?.wins_MURDER_DOUBLE_UP || 0)).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.deaths_MURDER_DOUBLE_UP || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                      </div>
                      <div style="margin-top: 250px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.MurderMystery?.wins_MURDER_DOUBLE_UP || 0, (player?.stats?.MurderMystery?.games_MURDER_DOUBLE_UP || 0) - (player?.stats?.MurderMystery?.wins_MURDER_DOUBLE_UP || 0))}</span><span class="white shadow">WLR</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.MurderMystery?.kills_MURDER_DOUBLE_UP || 0, player?.stats?.MurderMystery?.deaths_MURDER_DOUBLE_UP || 0)}</span><span class="white shadow">KDR</span></a>
                      </div>
                      <div style="margin-top: 320px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.knife_kills_MURDER_DOUBLE_UP || 0).toLocaleString()}</span><span class="white shadow">Knife Kills</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.bow_kills_MURDER_DOUBLE_UP || 0).toLocaleString()}</span><span class="white shadow">Bow Kills</span></a>
                      </div>
                      <div style="margin-top: 360px;position:absolute;" class="content-center"><a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.thrown_knife_kills_MURDER_DOUBLE_UP  || 0).toLocaleString()}</span><span class="white shadow">Knife Thrown Kills</span></a></div>
                    </div>
                    <div class="mm-display content-center" style="visibility:hidden;" id="mm_infection">
                      <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/6DAwzaA.png">
                      <div class="bwimgtt" style="margin-top:85px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getMmMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                      <div style="margin-top: 430px;" class="bsgimgstats3">
                        <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.was_hero_MURDER_INFECTION || 0).toLocaleString()}</span><span class="white shadow">Hero Wins</span></a>
                        <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.coins  || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                        <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.suicides_MURDER_INFECTION || 0).toLocaleString()}</span><span class="white shadow">Suicides</span></a>
                      </div>
                      <div style="margin-top: 190px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.wins_MURDER_INFECTION || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.kills_MURDER_INFECTION || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                      </div>
                      <div style="margin-top: 220px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.MurderMystery?.games_MURDER_INFECTION || 0) - (player?.stats?.MurderMystery?.wins_MURDER_INFECTION || 0)).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.deaths_MURDER_INFECTION || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                      </div>
                      <div style="margin-top: 250px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.MurderMystery?.wins_MURDER_INFECTION || 0, (player?.stats?.MurderMystery?.games_MURDER_INFECTION || 0) - (player?.stats?.MurderMystery?.wins_MURDER_INFECTION || 0))}</span><span class="white shadow">WLR</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.MurderMystery?.kills_MURDER_INFECTION || 0, player?.stats?.MurderMystery?.deaths_MURDER_INFECTION || 0)}</span><span class="white shadow">KDR</span></a>
                      </div>
                      <div style="margin-top: 320px;" class="mwimgstats2">
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.knife_kills_MURDER_INFECTION || 0).toLocaleString()}</span><span class="white shadow">Knife Kills</span></a>
                        <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.bow_kills_MURDER_INFECTION || 0).toLocaleString()}</span><span class="white shadow">Bow Kills</span></a>
                      </div>
                      <div style="margin-top: 360px;position:absolute;" class="content-center"><a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.MurderMystery?.thrown_knife_kills_MURDER_INFECTION  || 0).toLocaleString()}</span><span class="white shadow">Knife Thrown Kills</span></a></div>
                    </div>
                  </div>
                </div>
               <div class="tab">
                  <input class="input56" type="checkbox" id="chck12">
                  <label class="tab-label" for="chck12">SkyWars</label>
                  <div style="height: 532px;"class="tab-content">
                  <div id="sw-select" class="content-center">
                    <select>
                      <option>Solo Overall</option>
                      <option>Solo Normal</option>
                      <option>Solo Insane</option>
                    </select>
                    <select>
                      <option>Doubles Overall</option>
                      <option>Doubles Normal</option>
                      <option>Doubles Insane</option>
                    </select>
                    <button id="sw-overall" class="sw-button-top">Overall</button>
                    <button id="sw-mega" class="sw-button-top">Mega</button>
                    <button id="sw-ranked" class="sw-button-top">Ranked</button>
                  </div>
                  <div class="sw-display content-center" style="visibility:hidden;" id="sw_solo_overall">
                  <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/nlY53sX.png">
                  <div class="bwimgtt" style="margin-top:18px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1><span></span>${this.getFormatedSkywarsBracket()} ${displayName} ${gcolor}</h1></a></div>
                  <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getSwMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                  <div style="margin-top: 440px;" class="bsgimgstats3">
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.assists_solo || 0).toLocaleString()}</span><span class="white shadow">Assists</span></a>
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.chests_opened_solo || 0).toLocaleString()}</span><span class="white shadow">Chests Opened</span></a>
                  </div>
                  <div style="margin-top: 180px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.wins_solo || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.kills_solo || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                  </div>
                  <div style="margin-top: 210px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.losses_solo || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.deaths_solo || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                  </div>
                  <div style="margin-top: 240px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.wins_solo || 0, player?.stats?.SkyWars?.losses_solo || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.kills_solo || 0, player?.stats?.SkyWars?.deaths_solo || 0)}</span><span class="white shadow">KDR</span></a>
                  </div>
                  <div style="margin-top: 320px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.souls || 0).toLocaleString()}</span><span class="white shadow">Souls</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.shard || 0).toLocaleString()}</span><span class="white shadow">Shards</span></a>
                  </div>
                  <div style="margin-top: 350px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.heads || 0).toLocaleString()}</span><span class="white shadow">Heads</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.opals || 0).toLocaleString()}</span><span class="white shadow">Opals</span></a>
                  </div>
                  </div>
                  <div class="sw-display content-center" style="visibility:hidden;" id="sw_solo_normal">
                  <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/2GxJhzs.png">
                  <div class="bwimgtt" style="margin-top:18px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1><span></span>${this.getFormatedSkywarsBracket()} ${displayName} ${gcolor}</h1></a></div>
                  <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getSwMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                  <div style="margin-top: 440px;" class="bsgimgstats3">
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.assists_solo || 0).toLocaleString()}</span><span class="white shadow">Assists</span></a>
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.chests_opened_solo || 0).toLocaleString()}</span><span class="white shadow">Chests Opened</span></a>
                  </div>
                  <div style="margin-top: 180px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.wins_solo_normal || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.kills_solo_normal || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                  </div>
                  <div style="margin-top: 210px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.losses_solo_normal || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.deaths_solo_normal || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                  </div>
                  <div style="margin-top: 240px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.wins_solo_normal || 0, player?.stats?.SkyWars?.losses_solo_normal || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.kills_solo_normal || 0, player?.stats?.SkyWars?.deaths_solo_normal || 0)}</span><span class="white shadow">KDR</span></a>
                  </div>
                  <div style="margin-top: 320px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.souls || 0).toLocaleString()}</span><span class="white shadow">Souls</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.shard || 0).toLocaleString()}</span><span class="white shadow">Shards</span></a>
                  </div>
                  <div style="margin-top: 350px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.heads || 0).toLocaleString()}</span><span class="white shadow">Heads</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.opals || 0).toLocaleString()}</span><span class="white shadow">Opals</span></a>
                  </div>
                  </div>
                  <div class="sw-display content-center" style="visibility:hidden;" id="sw_solo_insane">
                  <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/wrZksgY.png">
                  <div class="bwimgtt" style="margin-top:18px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1><span></span>${this.getFormatedSkywarsBracket()} ${displayName} ${gcolor}</h1></a></div>
                  <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getSwMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                  <div style="margin-top: 440px;" class="bsgimgstats3">
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.assists_solo || 0).toLocaleString()}</span><span class="white shadow">Assists</span></a>
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.chests_opened_solo || 0).toLocaleString()}</span><span class="white shadow">Chests Opened</span></a>
                  </div>
                  <div style="margin-top: 180px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.wins_solo_insane || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.kills_solo_insane || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                  </div>
                  <div style="margin-top: 210px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.losses_solo_insane || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.deaths_solo_insane || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                  </div>
                  <div style="margin-top: 240px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.wins_solo_insane || 0, player?.stats?.SkyWars?.losses_solo_insane || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.kills_solo_insane || 0, player?.stats?.SkyWars?.deaths_solo_insane || 0)}</span><span class="white shadow">KDR</span></a>
                  </div>
                  <div style="margin-top: 320px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.souls || 0).toLocaleString()}</span><span class="white shadow">Souls</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.shard || 0).toLocaleString()}</span><span class="white shadow">Shards</span></a>
                  </div>
                  <div style="margin-top: 350px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.heads || 0).toLocaleString()}</span><span class="white shadow">Heads</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.opals || 0).toLocaleString()}</span><span class="white shadow">Opals</span></a>
                  </div>
                  </div>
                  <div class="sw-display content-center" style="visibility:hidden;" id="sw_double_overall">
                  <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/zRHnaEh.png">
                  <div class="bwimgtt" style="margin-top:18px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1><span></span>${this.getFormatedSkywarsBracket()} ${displayName} ${gcolor}</h1></a></div>
                  <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getSwMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                  <div style="margin-top: 440px;" class="bsgimgstats3">
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.assists_team || 0).toLocaleString()}</span><span class="white shadow">Assists</span></a>
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.chests_opened_team || 0).toLocaleString()}</span><span class="white shadow">Chests Opened</span></a>
                  </div>
                  <div style="margin-top: 180px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.wins_team || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.kills_team || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                  </div>
                  <div style="margin-top: 210px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.losses_team || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.deaths_team || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                  </div>
                  <div style="margin-top: 240px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.wins_team || 0, player?.stats?.SkyWars?.losses_team || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.kills_team || 0, player?.stats?.SkyWars?.deaths_team || 0)}</span><span class="white shadow">KDR</span></a>
                  </div>
                  <div style="margin-top: 320px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.souls || 0).toLocaleString()}</span><span class="white shadow">Souls</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.shard || 0).toLocaleString()}</span><span class="white shadow">Shards</span></a>
                  </div>
                  <div style="margin-top: 350px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.heads || 0).toLocaleString()}</span><span class="white shadow">Heads</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.opals || 0).toLocaleString()}</span><span class="white shadow">Opals</span></a>
                  </div>
                  </div>
                  <div class="sw-display content-center" style="visibility:hidden;" id="sw_double_normal">
                  <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/265KK0a.png">
                  <div class="bwimgtt" style="margin-top:18px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1><span></span>${this.getFormatedSkywarsBracket()} ${displayName} ${gcolor}</h1></a></div>
                  <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getSwMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                  <div style="margin-top: 440px;" class="bsgimgstats3">
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.assists_team || 0).toLocaleString()}</span><span class="white shadow">Assists</span></a>
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.chests_opened_team || 0).toLocaleString()}</span><span class="white shadow">Chests Opened</span></a>
                  </div>
                  <div style="margin-top: 180px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.wins_team_normal || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.kills_team_normal || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                  </div>
                  <div style="margin-top: 210px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.losses_team_normal || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.deaths_team_normal || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                  </div>
                  <div style="margin-top: 240px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.wins_team_normal || 0, player?.stats?.SkyWars?.losses_team_normal || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.kills_team_normal || 0, player?.stats?.SkyWars?.deaths_team_normal || 0)}</span><span class="white shadow">KDR</span></a>
                  </div>
                  <div style="margin-top: 320px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.souls || 0).toLocaleString()}</span><span class="white shadow">Souls</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.shard || 0).toLocaleString()}</span><span class="white shadow">Shards</span></a>
                  </div>
                  <div style="margin-top: 350px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.heads || 0).toLocaleString()}</span><span class="white shadow">Heads</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.opals || 0).toLocaleString()}</span><span class="white shadow">Opals</span></a>
                  </div>
                  </div>
                  <div class="sw-display content-center" style="visibility:hidden;" id="sw_double_insane">
                  <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/Lwwc5LR.png">
                  <div class="bwimgtt" style="margin-top:18px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1><span></span>${this.getFormatedSkywarsBracket()} ${displayName} ${gcolor}</h1></a></div>
                  <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getSwMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                  <div style="margin-top: 440px;" class="bsgimgstats3">
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.assists_team || 0).toLocaleString()}</span><span class="white shadow">Assists</span></a>
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.chests_opened_team || 0).toLocaleString()}</span><span class="white shadow">Chests Opened</span></a>
                  </div>
                  <div style="margin-top: 180px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.wins_team_insane || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.kills_team_insane || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                  </div>
                  <div style="margin-top: 210px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.losses_team_insane || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.deaths_team_insane || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                  </div>
                  <div style="margin-top: 240px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.wins_team_insane || 0, player?.stats?.SkyWars?.losses_team_insane || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.kills_team_insane || 0, player?.stats?.SkyWars?.deaths_team_insane || 0)}</span><span class="white shadow">KDR</span></a>
                  </div>
                  <div style="margin-top: 320px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.souls || 0).toLocaleString()}</span><span class="white shadow">Souls</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.shard || 0).toLocaleString()}</span><span class="white shadow">Shards</span></a>
                  </div>
                  <div style="margin-top: 350px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.heads || 0).toLocaleString()}</span><span class="white shadow">Heads</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.opals || 0).toLocaleString()}</span><span class="white shadow">Opals</span></a>
                  </div>
                  </div>
                  <div class="sw-display content-center" style="" id="sw_overall">
                  <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/w2xWsNU.png">
                  <div class="bwimgtt" style="margin-top:18px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1><span></span>${this.getFormatedSkywarsBracket()} ${displayName} ${gcolor}</h1></a></div>
                  <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getSwMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                  <div style="margin-top: 440px;" class="bsgimgstats3">
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.assists || 0).toLocaleString()}</span><span class="white shadow">Assists</span></a>
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.chests_opened || 0).toLocaleString()}</span><span class="white shadow">Chests Opened</span></a>
                  </div>
                  <div style="margin-top: 180px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                  </div>
                  <div style="margin-top: 210px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                  </div>
                  <div style="margin-top: 240px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.wins || 0, player?.stats?.SkyWars?.losses || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.kills || 0, player?.stats?.SkyWars?.deaths || 0)}</span><span class="white shadow">KDR</span></a>
                  </div>
                  <div style="margin-top: 320px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.souls || 0).toLocaleString()}</span><span class="white shadow">Souls</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.shard || 0).toLocaleString()}</span><span class="white shadow">Shards</span></a>
                  </div>
                  <div style="margin-top: 350px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.heads || 0).toLocaleString()}</span><span class="white shadow">Heads</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.opals || 0).toLocaleString()}</span><span class="white shadow">Opals</span></a>
                  </div>
                  </div>
                  <div class="sw-display content-center" style="visibility:hidden;" id="sw_mega">
                  <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/ew9AKjz.png">
                  <div class="bwimgtt" style="margin-top:18px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1><span></span>${this.getFormatedSkywarsBracket()} ${displayName} ${gcolor}</h1></a></div>
                  <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getSwMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                  <div style="margin-top: 440px;" class="bsgimgstats3">
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.assists_mega || 0).toLocaleString()}</span><span class="white shadow">Assists</span></a>
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    <a class="nowrap" style="font-size:14px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.chests_opened_mega || 0).toLocaleString()}</span><span class="white shadow">Chests Opened</span></a>
                  </div>
                  <div style="margin-top: 180px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.wins_mega || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.kills_mega || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                  </div>
                  <div style="margin-top: 210px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.losses_mega || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.deaths_mega || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                  </div>
                  <div style="margin-top: 240px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.wins_mega || 0, player?.stats?.SkyWars?.losses_mega || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.kills_mega || 0, player?.stats?.SkyWars?.deaths_mega || 0)}</span><span class="white shadow">KDR</span></a>
                  </div>
                  <div style="margin-top: 320px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.souls || 0).toLocaleString()}</span><span class="white shadow">Souls</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.shard || 0).toLocaleString()}</span><span class="white shadow">Shards</span></a>
                  </div>
                  <div style="margin-top: 350px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.heads || 0).toLocaleString()}</span><span class="white shadow">Heads</span></a>
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.opals || 0).toLocaleString()}</span><span class="white shadow">Opals</span></a>
                  </div>
                  </div>
                  <div class="sw-display content-center" style="visibility:hidden;" id="sw_ranked">
                  <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/XcvX4tM.png">
                  <div class="bwimgtt" style="margin-top:18px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1><span></span>${this.getFormatedSkywarsBracket()} ${displayName} ${gcolor}</h1></a></div>
                  <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.rankedKitParser(player?.stats?.SkyWars?.activeKit_RANKED)}</span><span style="color:#F2F2F2">Active Kit</span></a></div>
                  <div style="margin-top: 440px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(rr?.score || 0).toLocaleString()}</span><span class="white shadow">Current Rating</span></a>
                    <a class="nowrap" style="font-size:16px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">#${(rr?.position || 0).toLocaleString()}</span><span class="white shadow">Current Position</span></a>
                  </div>
                  <div style="margin-top: 170px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.wins_ranked || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                  </div>
                  <div style="margin-top: 200px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.losses_ranked|| 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                  </div>
                  <div style="margin-top: 230px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.wins_ranked || 0, player?.stats?.SkyWars?.losses_ranked || 0)}</span><span class="white shadow">WLR</span></a>
                  </div>
                  <div style="margin-top: 310px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.kills_ranked || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                  </div>
                  <div style="margin-top: 340px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SkyWars?.deaths_ranked|| 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                  </div>
                  <div style="margin-top: 370px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SkyWars?.kills_ranked || 0, player?.stats?.SkyWars?.deaths_ranked || 0)}</span><span class="white shadow">KDR</span></a>
                  </div>
                  <div id="ranked_rating">
                  </div>
                  </div>
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck13">
                  <label class="tab-label" for="chck13">Smash Heroes</label>
                  <div style="height: 532px;"class="tab-content">
                  <div style="margin-bottom:15px;" class="content-center">
                    <button id="sh-solo" class="sh-button-top">Solo</button>
                    <button id="sh-2v2" class="sh-button-top">2v2</button>
                    <button id="sh-overall" class="sh-button-top">Overall</button>
                    <button id="sh-2v2v2" class="sh-button-top">2v2v2</button>
                    <button id="sh-kits" class="sh-button-top">Kits</button>
                  </div>
                  <div class="sh-display content-center" style="visibility:hidden;" id="sh_solo">
                    <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/u2Hdgqe.png">
                    <div class="bwimgtt" style="margin-top:93px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getShMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                    <div style="margin-top: 220px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.wins_normal || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.kills_normal  || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    </div>
                    <div style="margin-top: 250px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.losses_normal  || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.deaths_normal  || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    </div>
                    <div style="margin-top: 280px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SuperSmash?.wins_normal  || 0, player?.stats?.SuperSmash?.losses_normal  || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SuperSmash?.kills_normal  || 0, player?.stats?.SuperSmash?.deaths_normal  || 0)}</span><span class="white shadow">KDR</span></a>
                    </div>
                    <div style="margin-top: 430px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.smashLevel || 0).toLocaleString()}</span><span class="white shadow">Level</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.smashed_normal  || 0).toLocaleString()}</span><span class="white shadow">Smashed</span></a>
                    </div>
                  </div>
                  <div class="sh-display content-center" style="visibility:hidden;" id="sh_2v2">
                    <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/JgAwDQp.png">
                    <div class="bwimgtt" style="margin-top:93px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getShMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                    <div style="margin-top: 220px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.wins_2v2 || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.kills_2v2 || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    </div>
                    <div style="margin-top: 250px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.losses_2v2 || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.deaths_2v2 || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    </div>
                    <div style="margin-top: 280px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SuperSmash?.wins_2v2 || 0, player?.stats?.SuperSmash?.losses_2v2 || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SuperSmash?.kills_2v2 || 0, player?.stats?.SuperSmash?.deaths_2v2 || 0)}</span><span class="white shadow">KDR</span></a>
                    </div>
                    <div style="margin-top: 430px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.smashLevel || 0).toLocaleString()}</span><span class="white shadow">Level</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.smashed_2v2 || 0).toLocaleString()}</span><span class="white shadow">Smashed</span></a>
                    </div>
                  </div>
                  <div class="sh-display content-center" style="" id="sh_overall">
                    <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/027j3cE.png">
                    <div class="bwimgtt" style="margin-top:93px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getShMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                    <div style="margin-top: 220px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    </div>
                    <div style="margin-top: 250px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    </div>
                    <div style="margin-top: 280px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SuperSmash?.wins || 0, player?.stats?.SuperSmash?.losses || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SuperSmash?.kills || 0, player?.stats?.SuperSmash?.deaths || 0)}</span><span class="white shadow">KDR</span></a>
                    </div>
                    <div style="margin-top: 430px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.smashLevel || 0).toLocaleString()}</span><span class="white shadow">Level</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.smashed || 0).toLocaleString()}</span><span class="white shadow">Smashed</span></a>
                    </div>
                  </div>
                  <div class="sh-display content-center" style="visibility:hidden;" id="sh_2v2v2">
                    <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/rBJKVQD.png">
                    <div class="bwimgtt" style="margin-top:93px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getShMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                    <div style="margin-top: 220px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.wins_teams || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.kills_teams || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    </div>
                    <div style="margin-top: 250px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.losses_teams || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.deaths_teams || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    </div>
                    <div style="margin-top: 280px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SuperSmash?.wins_teams || 0, player?.stats?.SuperSmash?.losses_teams || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SuperSmash?.kills_teams || 0, player?.stats?.SuperSmash?.deaths_teams || 0)}</span><span class="white shadow">KDR</span></a>
                    </div>
                    <div style="margin-top: 430px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.smashLevel || 0).toLocaleString()}</span><span class="white shadow">Level</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SuperSmash?.smashed_teams || 0).toLocaleString()}</span><span class="white shadow">Smashed</span></a>
                    </div>
                  </div>
                  <div class="sh-display content-center" style="visibility:hidden;margin-left: 50px;margin-top: 185px;" id="sh_kits">
                    <img style="transform: scale(1.2);" src="https://gen.plancke.io/supersmash/${uuid}/2.png">
                  </div>
                  </div>
                </div>
               <div class="tab">
                  <input class="input56" type="checkbox" id="chck14">
                  <label class="tab-label" for="chck14">Speed UHC</label>
                  <div style="height: 532px;"class="tab-content">
                  <div style="margin-bottom:15px;" class="content-center">
                    <button id="suhc-solos" class="suhc-button-top">Solo</button>
                    <button id="suhc-overall" class="suhc-button-top">Overall</button>
                    <button id="suhc-teams" class="suhc-button-top">Teams</button>
                  </div>
                  <div class="suhc-display content-center" style="visibility:hidden;" id="suhc_solos">
                    <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/Oh2u3UX.png">
                    <div class="bwimgtt" style="margin-top:16px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1>${this.mcColorParser(this.getSpeedUhcTitle(player?.stats?.SpeedUHC?.score || 0).formattedLevel)} ${displayName} ${gcolor}</h1></a></div>
                    <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getSpeedUhcMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                    <div style="margin-top: 230px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.wins_solo || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.kills_solo || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    </div>
                    <div style="margin-top: 260px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.losses_solo || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.deaths_solo || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    </div>
                    <div style="margin-top: 290px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SpeedUHC?.wins_solo || 0, player?.stats?.SpeedUHC?.losses_solo || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SpeedUHC?.kills_solo || 0, player?.stats?.SpeedUHC?.deaths_solo || 0)}</span><span class="white shadow">KDR</span></a>
                    </div>
                    <div style="margin-top: 430px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${this.getSpeedUhcTitle(player?.stats?.SpeedUHC?.score || 0).title}</span><span class="white shadow">Title</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.score_solo || 0).toLocaleString()}</span><span class="white shadow">Score</span></a>
                    </div>
                  </div>
                  <div class="suhc-display content-center" style="" id="suhc_overall">
                    <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/pYnSV79.png">
                    <div class="bwimgtt" style="margin-top:16px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1>${this.mcColorParser(this.getSpeedUhcTitle(player?.stats?.SpeedUHC?.score || 0).formattedLevel)} ${displayName} ${gcolor}</h1></a></div>
                    <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getSpeedUhcMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                    <div style="margin-top: 230px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.wins_normal || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.kills_normal || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    </div>
                    <div style="margin-top: 260px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.losses_normal || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.deaths_normal || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    </div>
                    <div style="margin-top: 290px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SpeedUHC?.wins_normal || 0, player?.stats?.SpeedUHC?.losses_normal || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SpeedUHC?.kills_normal || 0, player?.stats?.SpeedUHC?.deaths_normal || 0)}</span><span class="white shadow">KDR</span></a>
                    </div>
                    <div style="margin-top: 430px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${this.getSpeedUhcTitle(player?.stats?.SpeedUHC?.score || 0).title}</span><span class="white shadow">Title</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.score || 0).toLocaleString()}</span><span class="white shadow">Score</span></a>
                    </div>
                  </div>
                  <div class="suhc-display content-center" style="visibility:hidden;" id="suhc_teams">
                    <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/n6rmbuM.png">
                    <div class="bwimgtt" style="margin-top:16px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1>${this.mcColorParser(this.getSpeedUhcTitle(player?.stats?.SpeedUHC?.score || 0).formattedLevel)} ${displayName} ${gcolor}</h1></a></div>
                    <div class="bwimgtt" style="margin-top:95px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getSpeedUhcMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                    <div style="margin-top: 230px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.wins_team || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.kills_team || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    </div>
                    <div style="margin-top: 260px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.losses_team || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.deaths_team || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    </div>
                    <div style="margin-top: 290px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SpeedUHC?.wins_team || 0, player?.stats?.SpeedUHC?.losses_team || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.SpeedUHC?.kills_team || 0, player?.stats?.SpeedUHC?.deaths_team || 0)}</span><span class="white shadow">KDR</span></a>
                    </div>
                    <div style="margin-top: 430px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${this.getSpeedUhcTitle(player?.stats?.SpeedUHC?.score || 0).title}</span><span class="white shadow">Title</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.SpeedUHC?.score_team || 0).toLocaleString()}</span><span class="white shadow">Score</span></a>
                    </div>
                  </div>
                </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck15">
                  <label class="tab-label" for="chck15">TNT Games</label>
                  <div class="tab-content" style="height:880px;">
                  <div class="content-center">
                  <div style="padding-top: 10px;"><a><span class="gold shadow" style="font-size:20px;font-family:Minecraftia;">${(player?.stats?.TNTGames?.coins || 0).toLocaleString()}</span><span class="white shadow" style="margin-left:7px;font-size:20px;font-family:Minecraftia;">Coins</span></a></div>
                  <div style="margin-top: 40px;position: absolute;">
                  <div class="arcade_table">
                    <div style="background-image: url(https://i.imgur.com/hAmWLyY.png" class="arcade_package">
                      <h1 class="duels-header">TNT Run</h1>
                      <div class="content-center">
                        <div style="margin-top: -10px;" class="tntcards3">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.TNTGames?.wins_tntrun || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.TNTGames?.deaths_tntrun || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.TNTGames?.wins_tntrun || 0, player?.stats?.TNTGames?.deaths_tntrun || 0).toLocaleString()}</span><span class="white shadow">WLR</span></a>
                        </div>
                        <div class="content-center" style="margin-top:30px;">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${this.secToTime(player?.stats?.TNTGames?.record_tntrun || 0)}</span><span class="white shadow">Best Time</span></a>
                        </div>
                      </div>
                    </div>
                    <div style="background-image: url(https://i.imgur.com/hAmWLyY.png" class="arcade_package">
                      <h1 class="duels-header">PvP Run</h1>
                      <div class="content-center">
                        <div style="margin-top: -10px;" class="tntcards3">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.TNTGames?.wins_pvprun || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.TNTGames?.deaths_pvprun || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.TNTGames?.wins_pvprun || 0, player?.stats?.TNTGames?.deaths_pvprun || 0).toLocaleString()}</span><span class="white shadow">WLR</span></a>
                        </div>
                        <div class="content-center" style="margin-top:30px;">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${this.secToTime(player?.stats?.TNTGames?.record_pvprun || 0)}</span><span class="white shadow">Best Time</span></a>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              <div style="margin-top: 320px;position: absolute;">
                  <div class="arcade_table">
                    <div style="background-image: url(https://i.imgur.com/hAmWLyY.png" class="arcade_package">
                      <h1 class="duels-header">TNT Tag</h1>
                      <div class="content-center">
                        <div style="margin-top: -10px;" class="tntcards3">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.TNTGames?.wins_tntag || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.TNTGames?.kills_tntag || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${(player?.achievements?.tntgames_clinic || 0).toLocaleString()}</span><span class="white shadow">Tags</span></a>
                        </div>
                      </div>
                    </div>
                    <div style="background-image: url(https://i.imgur.com/hAmWLyY.png" class="arcade_package">
                      <h1 class="duels-header">Bow Spleef</h1>
                      <div class="content-center">
                        <div style="margin-top: -10px;" class="tntcards3">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.TNTGames?.wins_bowspleef || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.TNTGames?.deaths_bowspleef || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.TNTGames?.wins_bowspleef || 0, player?.stats?.TNTGames?.deaths_bowspleef || 0).toLocaleString()}</span><span class="white shadow">WLR</span></a>
                        </div>
                        <div class="content-center" style="margin-top:30px;">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.TNTGames?.tags_bowspleef || 0).toLocaleString()}</span><span class="white shadow">Hits</span></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="margin-top: 600px;position:absolute;">
                <div class="arcade_table">
                  <div style="background-image: url(https://i.imgur.com/hAmWLyY.png" class="arcade_package">
                  <h1 class="duels-header">Wizards</h1>
                  <div class="content-center">
                      <div style="margin-top: -10px;" class="tntcards3">
                        <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.TNTGames?.kills_capture|| 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                        <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.TNTGames?.deaths_capture || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                        <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.TNTGames?.kills_capture || 0, player?.stats?.TNTGames?.deaths_capture || 0).toLocaleString()}</span><span class="white shadow">KDR</span></a>
                      </div>
                      <div class="content-center" style="margin-top:30px;">
                        <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.TNTGames?.wins_capture || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      </div>
                  </div>
                </div>
                </div>
              </div>
              </div>
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck16">
                  <label class="tab-label" for="chck16">UHC Champions</label>
                  <div style="height: 532px;"class="tab-content">
                  <div style="margin-bottom:15px;" class="content-center">
                    <button id="uhc-solo" class="uhc-button-top">Solo</button>
                    <button id="uhc-overall" class="uhc-button-top">Overall</button>
                    <button id="uhc-teams" class="uhc-button-top">Teams</button>
                  </div>
                  <div class="uhc-display content-center" style="visibility:hidden;" id="uhc_solo">
                    <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/7Rp908q.png">
                    <div class="bwimgtt" style="margin-top:16px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1>${this.mcColorParser(this.getUhcTitle(player?.stats?.UHC?.score || 0).formattedLevel)} ${displayName} ${gcolor}</h1></a></div>
                    <div class="bwimgtt" style="margin-top:97px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.rankedKitParser(player?.stats?.UHC?.equippedKit)}</span><span style="color:#F2F2F2">Active Kit</span></a></div>
                    <div style="margin-top: 430px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${this.getUhcTitle(player?.stats?.UHC?.score || 0).title}</span><span class="white shadow">Title</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.UHC?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.UHC?.score || 0).toLocaleString()}</span><span class="white shadow">Score</span></a>
                    </div>
                    <div style="margin-top: 190px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.UHC?.kills_solo || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.UHC?.deaths_solo || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.UHC?.kills_solo || 0, player?.stats?.UHC?.deaths_solo || 0)}</span><span class="white shadow">KDR</span></a>
                    </div>
                    <div style="margin-top: 280px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.UHC?.wins_solo || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.UHC?.heads_eaten_solo || 0).toLocaleString()}</span><span class="white shadow">Heads Eaten</span></a>
                    </div>
                    <div style="margin-top: 340px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.UHC?.ultimates_crafted_solo || 0).toLocaleString()}</span><span class="white shadow">Ultimates Crafted</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.UHC?.extra_ultimates_crafted_solo || 0).toLocaleString()}</span><span class="white shadow">Extra Ultimates</span></a>
                    </div>
                  </div>
                  <div class="uhc-display content-center" style="" id="uhc_overall">
                    <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/hIQH8fA.png">
                    <div class="bwimgtt" style="margin-top:16px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1>${this.mcColorParser(this.getUhcTitle(player?.stats?.UHC?.score || 0).formattedLevel)} ${displayName} ${gcolor}</h1></a></div>
                    <div class="bwimgtt" style="margin-top:97px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.rankedKitParser(player?.stats?.UHC?.equippedKit)}</span><span style="color:#F2F2F2">Active Kit</span></a></div>
                    <div style="margin-top: 430px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${this.getUhcTitle(player?.stats?.UHC?.score || 0).title}</span><span class="white shadow">Title</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.UHC?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.UHC?.score || 0).toLocaleString()}</span><span class="white shadow">Score</span></a>
                    </div>
                    <div style="margin-top: 190px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.achievements?.uhc_hunter || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.UHC?.deaths_solo || 0) + (player?.stats?.UHC?.deaths || 0)).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.achievements?.uhc_hunter || 0, (player?.stats?.UHC?.deaths_solo || 0) + (player?.stats?.UHC?.deaths || 0))}</span><span class="white shadow">KDR</span></a>
                    </div>
                    <div style="margin-top: 280px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.UHC?.wins || 0) + (player?.stats?.UHC?.wins_solo || 0)).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.UHC?.heads_eaten || 0) + (player?.stats?.UHC?.heads_eaten_solo || 0)).toLocaleString()}</span><span class="white shadow">Heads Eaten</span></a>
                    </div>
                    <div style="margin-top: 340px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.UHC?.ultimates_crafted || 0) + (player?.stats?.UHC?.ultimates_crafted_solo || 0)).toLocaleString()}</span><span class="white shadow">Ultimates Crafted</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.UHC?.extra_ultimates_crafted || 0) + (player?.stats?.UHC?.extra_ultimates_crafted_solo || 0)).toLocaleString()}</span><span class="white shadow">Extra Ultimates</span></a>
                    </div>
                  </div>
                  <div class="uhc-display content-center" style="visibility:hidden;" id="uhc_teams">
                    <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/WD5F4Hf.png">
                    <div class="bwimgtt" style="margin-top:16px;font-size:18px;font-family:MinecraftiaRegular;"><a><h1>${this.mcColorParser(this.getUhcTitle(player?.stats?.UHC?.score || 0).formattedLevel)} ${displayName} ${gcolor}</h1></a></div>
                    <div class="bwimgtt" style="margin-top:97px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.rankedKitParser(player?.stats?.UHC?.equippedKit)}</span><span style="color:#F2F2F2">Active Kit</span></a></div>
                    <div style="margin-top: 430px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${this.getUhcTitle(player?.stats?.UHC?.score || 0).title}</span><span class="white shadow">Title</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.UHC?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.UHC?.score || 0).toLocaleString()}</span><span class="white shadow">Score</span></a>
                    </div>
                    <div style="margin-top: 190px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.UHC?.kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.UHC?.deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.UHC?.kills || 0, player?.stats?.UHC?.deaths || 0)}</span><span class="white shadow">KDR</span></a>
                    </div>
                    <div style="margin-top: 280px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.UHC?.wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.UHC?.heads_eaten || 0).toLocaleString()}</span><span class="white shadow">Heads Eaten</span></a>
                    </div>
                    <div style="margin-top: 340px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.UHC?.ultimates_crafted || 0).toLocaleString()}</span><span class="white shadow">Ultimates Crafted</span></a>
                      <a class="nowrap" style="font-size:20px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.UHC?.extra_ultimates_crafted || 0).toLocaleString()}</span><span class="white shadow">Extra Ultimates</span></a>
                    </div>
                  </div>
                 </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck17">
                  <label class="tab-label" for="chck17">Warlords</label>
                  <div id="wr-tabcontent" style="height: 532px;"class="tab-content">
                  <div style="margin-bottom:15px;" class="content-center">
                    <button id="wr-stats" class="wr-button-top">Stats</button>
                    <button id="wr-kits" class="wr-button-top">Kits</button>
                  </div>
                  <div class="wr-display content-center" style="" id="wr_stats">
                    <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/Y2cIeEP.png">
                    <div class="bwimgtt" style="margin-top:83px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.rankedKitParser(player?.stats?.Battleground?.chosen_class)}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                    <div style="margin-top: 220px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Battleground?.wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Battleground?.kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    </div>
                    <div style="margin-top: 250px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Battleground?.losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Battleground?.deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    </div>
                    <div style="margin-top: 280px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Battleground?.wins || 0, player?.stats?.Battleground?.losses || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Battleground?.kills || 0, player?.stats?.Battleground?.deaths || 0)}</span><span class="white shadow">KDR</span></a>
                    </div>
                    <div style="margin-top: 430px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.win_streak || 0).toLocaleString()}</span><span class="white shadow">Winstreak</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.assists || 0).toLocaleString()}</span><span class="white shadow">Assists</span></a>
                    </div>
                  </div>
                  <div class="wr-display content-center" style="visibility:hidden;" id="wr_kits">
                  <div style="margin-top: 0px;position: absolute;">
                  <div class="arcade_table">
                    <div style="background-image: url(https://i.imgur.com/7R0a4MI.png" class="arcade_package">
                      <h1 class="duels-header">Mage</h1>
                      <div class="content-center">
                        <div style="margin-top: -10px;" class="duelcards">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.wins_mage || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.damage_mage || 0).toLocaleString()}</span><span class="white shadow">DMG</span></a>
                        </div>
                        <div style="margin-top: 10px;" class="duelcards">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.heal_mage || 0).toLocaleString()}</span><span class="white shadow">Heal</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.damage_prevented_mage || 0).toLocaleString()}</span><span class="white shadow">Prevent</span></a>
                        </div>
                        <div class="content-center" style="margin-top:40px">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Battleground?.damage_mage || 0) + (player?.stats?.Battleground?.heal_mage || 0) + (player?.stats?.Battleground?.damage_prevented_mage || 0)).toLocaleString()}</span><span class="white shadow">Total</span></a>
                        </div>
                      </div>
                    </div>
                    <div style="background-image: url(https://i.imgur.com/7R0a4MI.png" class="arcade_package">
                      <h1 class="duels-header">Warrior</h1>
                      <div class="content-center">
                        <div style="margin-top: -10px;" class="duelcards">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.wins_warrior || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.damage_warrior || 0).toLocaleString()}</span><span class="white shadow">DMG</span></a>
                        </div>
                        <div style="margin-top: 10px;" class="duelcards">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.heal_warrior || 0).toLocaleString()}</span><span class="white shadow">Heal</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.damage_prevented_warrior || 0).toLocaleString()}</span><span class="white shadow">Prevent</span></a>
                        </div>
                        <div class="content-center" style="margin-top:40px">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Battleground?.damage_warrior || 0) + (player?.stats?.Battleground?.heal_warrior || 0) + (player?.stats?.Battleground?.damage_prevented_warrior || 0)).toLocaleString()}</span><span class="white shadow">Total</span></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="margin-top: 270px;position: absolute;">
                <div class="arcade_table">
                  <div style="background-image: url(https://i.imgur.com/7R0a4MI.png" class="arcade_package">
                    <h1 class="duels-header">Paladin</h1>
                    <div class="content-center">
                        <div style="margin-top: -10px;" class="duelcards">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.wins_paladin || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.damage_paladin || 0).toLocaleString()}</span><span class="white shadow">DMG</span></a>
                        </div>
                        <div style="margin-top: 10px;" class="duelcards">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.heal_paladin || 0).toLocaleString()}</span><span class="white shadow">Heal</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.damage_prevented_paladin || 0).toLocaleString()}</span><span class="white shadow">Prevent</span></a>
                        </div>
                        <div class="content-center" style="margin-top:40px">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Battleground?.damage_paladin || 0) + (player?.stats?.Battleground?.heal_paladin || 0) + (player?.stats?.Battleground?.damage_prevented_paladin || 0)).toLocaleString()}</span><span class="white shadow">Total</span></a>
                        </div>
                    </div>
                  </div>
                  <div style="background-image: url(https://i.imgur.com/7R0a4MI.png" class="arcade_package">
                    <h1 class="duels-header">Shaman</h1>
                    <div class="content-center">
                        <div style="margin-top: -10px;" class="duelcards">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.wins_shaman || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.damage_shaman || 0).toLocaleString()}</span><span class="white shadow">DMG</span></a>
                        </div>
                        <div style="margin-top: 10px;" class="duelcards">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.heal_shaman || 0).toLocaleString()}</span><span class="white shadow">Heal</span></a>
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Battleground?.damage_prevented_shaman || 0).toLocaleString()}</span><span class="white shadow">Prevent</span></a>
                        </div>
                        <div class="content-center" style="margin-top:40px">
                          <a class="nowrap" style="font-size:12px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Battleground?.damage_shaman || 0) + (player?.stats?.Battleground?.heal_shaman || 0) + (player?.stats?.Battleground?.damage_prevented_shaman || 0)).toLocaleString()}</span><span class="white shadow">Total</span></a>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              </div>
              </div>
              </div>
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
                <label class="tab-label" for="chck18">Arena Brawl</label>
                <div style="height: 532px;"class="tab-content">
                <div style="margin-bottom:15px;" class="content-center">
                  <button id="ab-overall" class="ab-button-top">Overall</button>
                  <button id="ab-1v1" class="ab-button-top">1v1</button>
                  <button id="ab-2v2" class="ab-button-top">2v2</button>
                  <button id="ab-4v4" class="ab-button-top">4v4</button>
                </div>
                <div class="ab-display content-center" style="" id="ab_overall">
                <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/5PMcuUl.png">
                <div class="bwimgtt" style="margin-top:100px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getAbMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                <div style="margin-top: 220px;" class="mwimgstats2">
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Arena?.wins_1v1 || 0) + (player?.stats?.Arena?.wins_2v2 || 0) + (player?.stats?.Arena?.wins_4v4 || 0)).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Arena?.kills_1v1 || 0) + (player?.stats?.Arena?.kills_2v2 || 0) + (player?.stats?.Arena?.kills_4v4 || 0)).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                </div>
                <div style="margin-top: 250px;" class="mwimgstats2">
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Arena?.losses_1v1 || 0) + (player?.stats?.Arena?.losses_2v2 || 0) + (player?.stats?.Arena?.losses_4v4 || 0)).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Arena?.deaths_1v1 || 0) + (player?.stats?.Arena?.deaths_2v2 || 0) + (player?.stats?.Arena?.deaths_4v4 || 0)).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                </div>
                <div style="margin-top: 280px;" class="mwimgstats2">
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio((player?.stats?.Arena?.wins_1v1 || 0) + (player?.stats?.Arena?.wins_2v2 || 0) + (player?.stats?.Arena?.wins_4v4 || 0), (player?.stats?.Arena?.losses_1v1 || 0) + (player?.stats?.Arena?.losses_2v2  || 0) + (player?.stats?.Arena?.losses_4v4 || 0))}</span><span class="white shadow">WLR</span></a>
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio((player?.stats?.Arena?.kills_1v1 || 0) + (player?.stats?.Arena?.kills_2v2 || 0) + (player?.stats?.Arena?.kills_4v4 || 0), (player?.stats?.Arena?.deaths_1v1 || 0) + (player?.stats?.Arena?.deaths_2v2  || 0) + (player?.stats?.Arena?.deaths_4v4 || 0))}</span><span class="white shadow">KDR</span></a>
                </div>
                <div style="margin-top: 430px;" class="bsgimgstats3">
                  <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Arena?.win_streaks_1v1 || 0) + (player?.stats?.Arena?.win_streaks_2v2 || 0) + (player?.stats?.Arena?.win_streaks || 0)).toLocaleString()}</span><span class="white shadow">Winstreak</span></a>
                  <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Arena?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                  <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Arena?.keys || 0).toLocaleString()}</span><span class="white shadow">Keys</span></a>
                </div>
                </div>
                <div class="ab-display content-center" style="visibility:hidden;" id="ab_1v1">
                <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/dZVpwUj.png">
                <div class="bwimgtt" style="margin-top:100px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getAbMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                <div style="margin-top: 220px;" class="mwimgstats2">
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Arena?.wins_1v1 || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Arena?.kills_1v1 || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                </div>
                <div style="margin-top: 250px;" class="mwimgstats2">
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Arena?.losses_1v1 || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Arena?.deaths_1v1 || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                </div>
                <div style="margin-top: 280px;" class="mwimgstats2">
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Arena?.wins_1v1 || 0, player?.stats?.Arena?.losses_1v1 || 0)}</span><span class="white shadow">WLR</span></a>
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Arena?.kills_1v1 || 0, player?.stats?.Arena?.deaths_1v1 || 0)}</span><span class="white shadow">KDR</span></a>
                </div>
                <div style="margin-top: 430px;" class="bsgimgstats3">
                  <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Arena?.win_streaks_1v1 || 0).toLocaleString()}</span><span class="white shadow">Winstreak</span></a>
                  <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Arena?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                  <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Arena?.keys || 0).toLocaleString()}</span><span class="white shadow">Keys</span></a>
                </div>
                </div>
                <div class="ab-display content-center" style="visibility:hidden;" id="ab_2v2">
                <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/YIi8Drr.png">
                <div class="bwimgtt" style="margin-top:100px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getAbMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                <div style="margin-top: 220px;" class="mwimgstats2">
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Arena?.wins_2v2 || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Arena?.kills_2v2  || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                </div>
                <div style="margin-top: 250px;" class="mwimgstats2">
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Arena?.losses_2v2  || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Arena?.deaths_2v2  || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                </div>
                <div style="margin-top: 280px;" class="mwimgstats2">
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Arena?.wins_2v2  || 0, player?.stats?.Arena?.losses_2v2  || 0)}</span><span class="white shadow">WLR</span></a>
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Arena?.kills_2v2  || 0, player?.stats?.Arena?.deaths_2v2  || 0)}</span><span class="white shadow">KDR</span></a>
                </div>
                <div style="margin-top: 430px;" class="bsgimgstats3">
                  <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Arena?.win_streaks_2v2  || 0).toLocaleString()}</span><span class="white shadow">Winstreak</span></a>
                  <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Arena?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                  <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Arena?.keys || 0).toLocaleString()}</span><span class="white shadow">Keys</span></a>
                </div>
                </div>
                <div class="ab-display content-center" style="visibility:hidden;" id="ab_4v4">
                <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/pwxSias.png">
                <div class="bwimgtt" style="margin-top:100px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getAbMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                <div style="margin-top: 220px;" class="mwimgstats2">
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Arena?.wins_4v4 || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Arena?.kills_4v4 || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                </div>
                <div style="margin-top: 250px;" class="mwimgstats2">
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Arena?.losses_4v4 || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Arena?.deaths_4v4 || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                </div>
                <div style="margin-top: 280px;" class="mwimgstats2">
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Arena?.wins_4v4 || 0, player?.stats?.Arena?.losses_4v4 || 0)}</span><span class="white shadow">WLR</span></a>
                  <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Arena?.kills_4v4 || 0, player?.stats?.Arena?.deaths_4v4 || 0)}</span><span class="white shadow">KDR</span></a>
                </div>
                <div style="margin-top: 430px;" class="bsgimgstats3">
                  <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Arena?.win_streaks_4v4 || 0).toLocaleString()}</span><span class="white shadow">Winstreak</span></a>
                  <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Arena?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                  <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Arena?.keys || 0).toLocaleString()}</span><span class="white shadow">Keys</span></a>
                </div>
                </div>
                </div>
              </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck19">
                  <label class="tab-label" for="chck19">Paintball</label>
                  <div style="height: 474px;"class="tab-content">
                  <div class="content-center">
                    <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/dM3nhlG.png">
                    <div style="margin-top: 220px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Paintball?.kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Paintball?.wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    </div>
                    <div style="margin-top: 250px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Paintball?.deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Paintball?.shots_fired || 0).toLocaleString()}</span><span class="white shadow">Shots</span></a>
                    </div>
                    <div style="margin-top: 280px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Paintball?.kills || 0, player?.stats?.Paintball?.deaths || 0)}</span><span class="white shadow">KDR</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Paintball?.shots_fired || 0, player?.stats?.Paintball?.kills || 0)}</span><span class="white shadow">SKR</span></a>
                    </div>
                    <div style="margin-top: 430px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Paintball?.killstreaks || 0).toLocaleString()}</span><span class="white shadow">Streaks</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Paintball?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Paintball?.forcefieldTime|| 0).toLocaleString()}ms</span><span class="white shadow">Forcefield</span></a>
                    </div>
                  </div>
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck20">
                  <label class="tab-label" for="chck20">Quake</label>
                  <div style="height: 532px;"class="tab-content">
                  <div style="margin-bottom:15px;" class="content-center">
                    <button id="quake-solo" class="quake-button-top">Solo</button>
                    <button id="quake-overall" class="quake-button-top">Overall</button>
                    <button id="quake-teams" class="quake-button-top">Teams</button>
                  </div>
                  <div class="quake-display content-center" style="visibility:hidden;" id="quake_solo">
                  <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/TdX1k99.png">
                  <div class="bwimgtt" style="margin-top:97px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getQuakeMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                  <div style="margin-top: 220px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Quake?.kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Quake?.shots_fired || 0).toLocaleString()}</span><span class="white shadow">Fired</span></a>
                  </div>
                  <div style="margin-top: 250px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Quake?.deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Quake?.headshots || 0).toLocaleString()}</span><span class="white shadow">Headshots</span></a>
                  </div>
                  <div style="margin-top: 280px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Quake?.kills || 0, player?.stats?.Quake?.deaths || 0)}</span><span class="white shadow">KDR</span></a>
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Quake?.headshots || 0, player?.stats?.Quake?.kills || 0)}</span><span class="white shadow">HKR</span></a>
                  </div>
                  <div style="margin-top: 430px;" class="bsgimgstats3">
                    <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Quake?.wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Quake?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Quake?.killstreaks || 0).toLocaleString()}</span><span class="white shadow">Streaks</span></a>
                  </div>
                  </div>
                  <div class="quake-display content-center" style="" id="quake_overall">
                  <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/OXUbFUW.png">
                  <div class="bwimgtt" style="margin-top:97px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getQuakeMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                  <div style="margin-top: 220px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Quake?.kills || 0) + (player?.stats?.Quake?.kills_teams || 0)).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${((player?.stats?.Quake?.shots_fired || 0) + (player?.stats?.Quake?.shots_fired_teams  || 0)).toLocaleString()}</span><span class="white shadow">Fired</span></a>
                  </div>
                  <div style="margin-top: 250px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Quake?.deaths || 0) + (player?.stats?.Quake?.deaths_teams  || 0)).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${((player?.stats?.Quake?.headshots || 0) + (player?.stats?.Quake?.headshots_teams  || 0)).toLocaleString()}</span><span class="white shadow">Headshots</span></a>
                  </div>
                  <div style="margin-top: 280px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio((player?.stats?.Quake?.kills || 0) + (player?.stats?.Quake?.kills_teams  || 0), (player?.stats?.Quake?.deaths || 0) + (player?.stats?.Quake?.deaths_teams  || 0))}</span><span class="white shadow">KDR</span></a>
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio((player?.stats?.Quake?.headshots || 0) + (player?.stats?.Quake?.headshots_teams  || 0), (player?.stats?.Quake?.kills || 0) + (player?.stats?.Quake?.kills_teams  || 0))}</span><span class="white shadow">HKR</span></a>
                  </div>
                  <div style="margin-top: 430px;" class="bsgimgstats3">
                    <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Quake?.wins || 0) + player?.stats?.Quake?.wins_teams || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Quake?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${((player?.stats?.Quake?.killstreaks || 0) + (player?.stats?.Quake?.killstreaks_teams  || 0)).toLocaleString()}</span><span class="white shadow">Streaks</span></a>
                  </div>
                  </div>
                  <div class="quake-display content-center" style="visibility:hidden;" id="quake_teams">
                  <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/PSMQcAJ.png">
                  <div class="bwimgtt" style="margin-top:97px;font-size:18px;font-family:MinecraftiaRegular;"><a><span style="color:#93d2f2;margin-right:10px">${this.getQuakeMainMode()}</span><span style="color:#F2F2F2">Main Mode</span></a></div>
                  <div style="margin-top: 220px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Quake?.kills_teams || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Quake?.shots_fired_teams || 0).toLocaleString()}</span><span class="white shadow">Fired</span></a>
                  </div>
                  <div style="margin-top: 250px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Quake?.deaths_teams || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Quake?.headshots_teams || 0).toLocaleString()}</span><span class="white shadow">Headshots</span></a>
                  </div>
                  <div style="margin-top: 280px;" class="mwimgstats2">
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Quake?.kills_teams || 0, player?.stats?.Quake?.deaths_teams || 0)}</span><span class="white shadow">KDR</span></a>
                    <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Quake?.headshots_teams || 0, player?.stats?.Quake?.kills_teams || 0)}</span><span class="white shadow">HKR</span></a>
                  </div>
                  <div style="margin-top: 430px;" class="bsgimgstats3">
                    <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Quake?.wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                    <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Quake?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                    <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Quake?.killstreaks_teams || 0).toLocaleString()}</span><span class="white shadow">Streaks</span></a>
                  </div>
                  </div>
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck21">
                  <label class="tab-label" for="chck21">Turbo Kart Racers</label>
                  <div style="height: 474px;"class="tab-content">
                  <div class="content-center">
                    <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/kRqoaux.png">
                    <div style="margin-top: 220px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.GingerBread?.gold_trophy || 0).toLocaleString()}</span><span class="white shadow">Gold</span></a>
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.GingerBread?.laps_completed || 0).toLocaleString()}</span><span class="white shadow">Laps</span></a>
                    </div>
                    <div style="margin-top: 250px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.GingerBread?.silver_trophy || 0).toLocaleString()}</span><span class="white shadow">Silver</span></a>
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.GingerBread?.box_pickups || 0).toLocaleString()}</span><span class="white shadow">Boxes Collected</span></a>
                    </div>
                    <div style="margin-top: 280px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.GingerBread?.bronze_trophy || 0).toLocaleString()}</span><span class="white shadow">Bronze</span></a>
                      <a class="nowrap" style="font-size:19px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.GingerBread?.coins_picked_up || 0).toLocaleString()}</span><span class="white shadow">Coins Collected</span></a>
                    </div>
                    <div style="margin-top: 430px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.GingerBread?.wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.GingerBread?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.GingerBread?.grand_prix_tokens || 0).toLocaleString()}</span><span class="white shadow">GPT</span></a>
                    </div>
                  </div>
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck22">
                  <label class="tab-label" for="chck22">Vampirez</label>
                  <div style="height: 474px;"class="tab-content">
                  <div class="content-center">
                    <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/oAcjPfX.png">
                    <div style="margin-top: 220px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.VampireZ?.human_kills || 0).toLocaleString()}</span><span class="white shadow">Human Kills</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.VampireZ?.vampire_kills || 0).toLocaleString()}</span><span class="white shadow">Vampire Kills</span></a>
                    </div>
                    <div style="margin-top: 250px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.VampireZ?.human_deaths || 0).toLocaleString()}</span><span class="white shadow">Human Deaths</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.VampireZ?.vampire_deaths || 0).toLocaleString()}</span><span class="white shadow">Vampire Deaths</span></a>
                    </div>
                    <div style="margin-top: 280px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.VampireZ?.human_kills || 0, player?.stats?.VampireZ?.human_deaths || 0)}</span><span class="white shadow">Human KDR</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.VampireZ?.vampire_kills || 0, player?.stats?.VampireZ?.vampire_deaths || 0)}</span><span class="white shadow">Vampire KDR</span></a>
                    </div>
                    <div style="margin-top: 430px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.VampireZ?.human_wins || 0).toLocaleString()}</span><span class="white shadow">Human Wins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.VampireZ?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.VampireZ?.vampire_wins || 0).toLocaleString()}</span><span class="white shadow">Vampire Wins</span></a>
                    </div>
                  </div>
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck23">
                  <label class="tab-label" for="chck23">Walls</label>
                  <div style="height: 474px;"class="tab-content">
                  <div class="content-center">
                    <img style="transform:scale(.448);margin-top: -290px;border-radius: 23px;position:absolute;z-index:-1;" src="https://i.imgur.com/PnF2bZ1.png">
                    <div style="margin-top: 220px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Walls?.wins || 0).toLocaleString()}</span><span class="white shadow">Wins</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="green shadow"style="margin-right:10px">${(player?.stats?.Walls?.kills || 0).toLocaleString()}</span><span class="white shadow">Kills</span></a>
                    </div>
                    <div style="margin-top: 250px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Walls?.losses || 0).toLocaleString()}</span><span class="white shadow">Losses</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="red shadow"style="margin-right:10px">${(player?.stats?.Walls?.deaths || 0).toLocaleString()}</span><span class="white shadow">Deaths</span></a>
                    </div>
                    <div style="margin-top: 280px;" class="mwimgstats2">
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Walls?.wins || 0, player?.stats?.Walls?.losses || 0)}</span><span class="white shadow">WLR</span></a>
                      <a class="nowrap" style="font-size:22px;font-family:MinecraftiaRegular;"><span class="yellow shadow"style="margin-right:10px">${this.ratio(player?.stats?.Walls?.kills || 0, player?.stats?.Walls?.deaths || 0)}</span><span class="white shadow">KDR</span></a>
                    </div>
                    <div style="margin-top: 430px;" class="bsgimgstats3">
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Walls?.shout_count || 0).toLocaleString()}</span><span class="white shadow">Shouts</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Walls?.coins || 0).toLocaleString()}</span><span class="white shadow">Coins</span></a>
                      <a class="nowrap" style="font-size:18px;font-family:MinecraftiaRegular;"><span class="gold shadow"style="margin-right:10px">${(player?.stats?.Walls?.assists || 0).toLocaleString()}</span><span class="white shadow">Assists</span></a>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
              </div>
              </div>
              </div>`
              this.status()
              this.totemLoader()
              this.ptableLoader()
              this.gamesButtonLoader()
              this.bwBarLoader()
              this.blitzKitImageLoader()
              this.rankedRatingLoader()
              
              document.getElementById("zombies_table").addEventListener("click", this.showZomTable);



              if (document.getElementById('gmtbody')) {this.loadGuildMembers()}
              if (hyApi?.social?.discord) document.getElementById("click-discord").addEventListener("click", this.copyProfile);
        }


            };
        })(window.BDFDB_Global.PluginUtils.buildPlugin(config));
 })();
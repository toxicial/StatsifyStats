/**
 * @name StatsifyStats
 * @author Toxicial
 * @version 0.0.1
 * @invite ZzBFTh4zhm
 * @donate https://www.patreon.com/statsify
 * @patreon https://www.patreon.com/statsify
 * @website https://statsify.net
 * @source https://github.com/toxicial/StatsifyStats/blob/main/StatsifyStats.plugin.js
 * @updateUrl https://raw.githubusercontent.com/toxicial/StatsifyStats/main/StatsifyStats.plugin.js
 */
 module.exports = (() => {
    const config = {
		"info": {
			"name": "StatsifyStats",
			"author": "toxicial",
			"version": "0.0.1",
			"description": "Adds a Hypixel stats search within discord in the chat toolbar."
		},
		"changeLog": {
			"added": {
				"General Stats": "this plugin has some actual use now"
			},
      "fixed": {
				"Api Requesting": "getting an error upon entering a user's ign that dosent have data"
			},
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
            let player2;
            let profiles


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
                  #statsify{position:fixed;top:80px;right:16px;bottom:75px;width:900px;z-index:99;color:var(--text-normal);background-color:var(--background-secondary);padding-top: 16px;box-shadow:var(--elevation-stroke),var(--elevation-high);border-radius:8px;display:flex;flex-direction:column}
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
                  #statsify input:checked ~ .tab-content {max-height: 100vh;padding: 1em;}
                  .hidden{display: hidden;background-color: rgba(0, 0, 0, 0);}
                  .top-section-name{display: flex; justify-content: center; margin-top: 20px;}
                  .displaynametext{font-family: 'MinecraftiaRegular'; font-size: 30px; margin-top: 12px; margin-left: 20px;}
                  .skull{border-radius: 8px;}
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
                  .tab-content {max-height: 0;padding: 0 1em;color: #dcddde;background: #32353b;transition: all 0.35s;}
                  .tab-close {display: flex;justify-content: flex-end;padding: 1em;font-size: 0.75em;background: #2c3e50;cursor: pointer;}
                  .tab-close:hover {background: #1a252f;}
                  .content-center{display:flex;justify-content:center;}
                  .lvl-gs{transform: scale(.6); margin-bottom: -10px}
                  .ap-gs{transform: scale(.6);}
                  .gs-res{display: grid;margin-bottom: 50px;text-align: center;grid-template-columns:323px auto 223px;}
                  .gs-res1{display: grid;margin-bottom: 50px;text-align: center;grid-template-columns:323px auto 223px;}
                  .gs-a{margin-right: 70px;}
                  .status{position:absolute;width:28px;margin-top:10px;margin-left:820px;}
                  .profiles{display:flex;justify-content:center;margin-bottom:10px;}
                  .profile{width:36px;cursor:pointer;}
                  .profile:hover{opacity: 0.93;}
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
          <div class="back-arrow" id="back-arrow-icon">
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
                <input spellcheck="false" id="searchInput" class="input-3Xdcic" placeholder="Username/UUID" value="">
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
            
              

            return class StatsifyStats extends Plugin {

                
                
                onLoad () {
                    apiKey = BDFDB.DataUtils.load(this, "api");

                    
                    

                    const searchField = document.getElementById("searchInput")
                    searchField.addEventListener('keyup', event => {
                    if (event.keyCode === 13) this.getUUID()
                    })

                    document.getElementById("back-arrow-icon").onclick = this.backArrow;



                    this.patchedModules = {
                        after: {
                            
                        }
                    };
                }
                
                onStart () {
                  this.forceUpdateAll();
                    const form = document.querySelector("form");
                    if (form) this.addButton(form);
                    BDFDB.PatchUtils.forceAllUpdates(this);

                    
                }
                
                onStop () {
                    const button = document.querySelector(".statsify-btn");
                    if (button) button.remove();
                    BDFDB.PatchUtils.forceAllUpdates(this);
                }

                
    getSettingsPanel (collapseStates = {}) {
        
				let settingsPanel;
				return settingsPanel = BDFDB.PluginUtils.createSettingsPanel(this, {
					collapseStates: collapseStates,
					children: _ => {
						let settingsItems = [];
				
						for (let key in this.defaults.selections) settingsItems.push();
						
						
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
									})
                                    

								]
							})
						}));
						
						return settingsItems;
					}
				});
			}

            onSettingsClosed () {
				if (this.SettingsUpdated) {
					delete this.SettingsUpdated;
					this.forceUpdateAll();
				}
			}

            forceUpdateAll () {
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
            if (!username || username.length > 16) return;
            form.value = ""
            BDFDB.LibraryRequires.request(`https://api.mojang.com/users/profiles/minecraft/${username}`, (err, res) => {
                if (res.statusCode !== 200) return BDFDB.NotificationUtils.toast(`${username} does not exist`, {type: "danger"});
                const data =  JSON.parse(res.body);
                uuid = data.id
                user = username
                if (uuid) this.getPlayer()
        })
    }


        getPlayer() {
            BDFDB.LibraryRequires.request(`https://api.hypixel.net/player?key=${apiKey}&uuid=${uuid}`, (err, res) => {
              if (res.statusCode == 403) BDFDB.NotificationUtils.toast("Invalid Api Key", {type: "danger"});
              else if (res.statusCode == 429) BDFDB.NotificationUtils.toast("Requesting Too Much", {type: "danger"});
                else if (res.statusCode == 200) {
                const body = JSON.parse(res.body);
                player = body?.player

                rank = this.getRank(player)
                plusColor = this.getPlusColor(rank, player.rankPlusColor)
                formattedRank = this.getFormattedRank(rank, plusColor.mc)

                const ign = `${formattedRank}${player.displayname}`
                displayName = this.mcColorParser(ign)

                if (player) this.getPlayer2()
              }
                  else BDFDB.NotificationUtils.toast("Server or Api is Down", {type: "danger"});
            })
        }

        getPlayer2() {
          BDFDB.LibraryRequires.request(`https://hyapi.tech/player?uuid=${uuid}&key=statsifystats`, (err, res) => {
            if (res.statusCode == 200 || res.statusCode == 404) {
            const player = JSON.parse(res.body);
            console.log(res)
            player2 = player
            if (player2) this.getGuild()
            } 
              else BDFDB.NotificationUtils.toast("Server or Api is Down", {type: "danger"});
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
            const textbar = document.querySelector('[class^=buttons-3JBrkn]');
            if (textbar) textbar.appendChild(buttonHTML);
            buttonHTML.onclick = () => {
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
            const textbar = e.addedNodes[0].querySelector('[class^=buttons-3JBrkn]');
            if (textbar) this.addButton(textbar);
        }


        getRank = player => {
            let rank = 'NON';
            if (player.monthlyPackageRank || player.packageRank || player.newPackageRank) {
              if (player.monthlyPackageRank == "SUPERSTAR") rank = replaceRank(player.monthlyPackageRank);
              else {
                if (player.packageRank && player.newPackageRank) rank = replaceRank(player.newPackageRank);
                else rank = replaceRank(player.packageRank || player.newPackageRank);
              }
            }
            if (player.rank && player.rank != 'NORMAL') rank = player.rank.replace('MODERATOR', 'MOD');
            if (player.prefix) rank = player.prefix.replace(/§.|\[|]/g, '');
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
          
            splitText.forEach(parts => finalText += `<span class="${colors[parts[0]].color} shadow">${parts.split("").slice(1).join("")}</span>`)
            return finalText
          }

          status() {
            let online = player2.online;
            let status = document.getElementById("status");

            if (online == true) status.src="https://statsify.net/img/assets/online.png";
            else {
              status.src="https://statsify.net/img/assets/offline.png";
            }      
          }
            

          loadProfile() {
            const profile = `${player2?.social ? `<div class="profiles">
            ${player2?.social?.youtube ? `<a style="cursor: default;" class="youtube"><img title="Open Link to Youtube!" class="profile" data-tooltip="Open Link" onclick="window.open('${player2?.social?.youtube}')"id="click-youtube" style="margin-right: 1em;" src="https://cdn.discordapp.com/emojis/737967209057353799.png?v=1"><a>` : ""}
            ${player2?.social?.twitch ? `<a style="cursor: default;" class="twitch"><img title="Open Link to Twitch!" class="profile" data-tooltip="Open Link" onclick="window.open('${player2?.social?.twitch}')"id="click-twitch" style="margin-right: 1em;" src="https://cdn.discordapp.com/emojis/737967209350955029.png?v=1"></a>` : ""}
            ${player2?.social?.twitter ? `<a style="cursor: default;" class="twitter"><img title="Open Link to Twitter!" class="profile" data-tooltip="Open Link" onclick="window.open('${player2?.social?.twitter}')"id="click-twitter" style="margin-right: 1em;" src="https://cdn.discordapp.com/emojis/737967209241903145.png?v=1"></a>` : ""}
            ${player2?.social?.instagram ? `<a style="cursor: default;" class="instagram"><img title="Open Link to Instagram!" class="profile" data-tooltip="Open Link" onclick="window.open('${player2?.social?.instagram}')"id="click-instagram" style="margin-right: 1em;" src="https://cdn.discordapp.com/emojis/737967209363669062.png?v=1"></a>` : ""}
            ${player2?.social?.hypixel ? `<a style="cursor: default;" class="hypixel"><img title="Open Link to Hypixel!" class="profile" data-tooltip="Open Link" onclick="window.open('${player2?.social?.hypixel}')"id="click-hypixel" style="margin-right: 1em;" src="https://cdn.discordapp.com/emojis/737967451622342666.png?v=1"></a>` : ""}
            ${player2?.social?.discord ? `<a style="cursor: default;" class="discord"><img class="profile" title="Copy!" id="click-discord" src="https://media.discordapp.net/attachments/805054249552576524/862809743013052446/Discord_Logo_Circle.png?width=701&height=701"><p id="profile-discord"style="font-size: 0px;position:absolute;">${player2?.social?.discord}</p></a>` : ""}
            </div>` : ""}`
            profiles = profile
          }     

        popoverUpdater() {    
              let tempbres = document.getElementById("bodyResult")

              let gcolor = "";
  
              var networkLevel = ((Math.sqrt(player.networkExp + 15312.5) - 125/Math.sqrt(2))/(25*Math.sqrt(2))).toFixed(0);

              var rawgcolor = `${guild.guild ? guild.guild.tag ? ` ${body_guild_mcColor.mc}[${guild.guild.tag}${body_guild_mcColor.mc}]` : "" : ""}`
              gcolor = this.mcColorParser(rawgcolor)

              
              this.loadProfile()

              tempbres.innerHTML = `<div>
                
              <a class=top-section-name> <img class="skull" src="https://crafatar.com/avatars/${uuid}?size=60&overlay=true"> <h1 class="displaynametext">${displayName} ${gcolor}</h1> </a> 

              <div class="row">
                <div class="col">
                  <div>
                    <div class="tab" style="width: 860px;">
                      <img id="status" class="status" src="">
                      <input class="input56" type="checkbox" id="chck1">
                      <label class="tab-label" for="chck1">General Stats</label>
                      <div class="tab-content">
                      <div class="">
                      <div class="gs-res">
                      <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Level</span> <span style="font-size: 18px;font-weight: bold;color: #FFAA00;"><br>${networkLevel}</span></a>
                      <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Quests</span> <span style="font-size: 18px;font-weight: bold;color: #71e11c;"><br>${(player2.quests || 0).toLocaleString()}</span></a>
                      <a class=""><span style="font-size: 20px;color: white;">Karma</span> <span style="font-size: 18px;font-weight: bold;color: #ff55ffd9;"><br>${(player.karma || 0).toLocaleString()}</span></a>
                      </div>
                      </div>
                      <div class="">
                      <div class="gs-res">
                      <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Ap</span> <span style="font-size: 18px;font-weight: bold;color: #FFAA00;"><br>${(player.achievementPoints || 0).toLocaleString()}</span></a>
                      <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Challenges</span> <span style="font-size: 18px;font-weight: bold;color: #71e11c;"><br>${(player2.challenges || 0).toLocaleString()}</span></a>
                      <a class=""><span style="font-size: 20px;color: white;">Friends</span> <span style="font-size: 18px;font-weight: bold;color: #ff55ffd9;"><br>${(friendCount || 0).toLocaleString()}</span></a>
                      </div>
                      </div>
                      <div class="">
                      <div class="gs-res">
                      <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">First Login</span> <span style="font-size: 18px;font-weight: bold;color: #FFAA00;"><br>${(new Date(player.firstLogin) || 0).toLocaleString()}</span></a>
                      <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Last Login</span> <span style="font-size: 18px;font-weight: bold;color: #71e11c;"><br>${(new Date(player2.lastLogin) || 0).toLocaleString()}</span></a>
                      <a class=""><span style="font-size: 20px;color: white;">Last Logout</span> <span style="font-size: 18px;font-weight: bold;color: #ff55ffd9;"><br>${(new Date(player2.lastLogout) || 0).toLocaleString()}</span></a>
                      </div>
                      </div>
                      <div class="">
                      <div class="gs-res">
                      <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Gifts Given</span> <span style="font-size: 18px;font-weight: bold;color: #AA00AA;"><br>${(player2?.gifted?.giftsGiven || 0).toLocaleString()}</span></a>
                      <a class="gs-a"><span style="color: white;margin-right: 1px;font-size: 20px;">Gifts Received</span> <span style="font-size: 18px;font-weight: bold;color: #AA00AA;"><br>${(player2?.gifted?.giftsReceived || 0).toLocaleString()}</span></a>
                      <a class=""><span style="color: white;margin-right: 1px;font-size: 20px;">Ranks Gifted</span> <span style="font-size: 18px;font-weight: bold;color: #AA00AA;"><br>${(player2?.gifted?.ranksGiven || 0).toLocaleString()}</span></a>
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
                        text
                      </div>
                    </div>
                  <div class="tab">
                    <input class="input56" type="checkbox" id="chck3">
                    <label class="tab-label" for="chck3">Pet Stats</label>
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
                  <input class="input56" type="checkbox" id="chck4">
                  <label class="tab-label" for="chck4">Item 3</label>
                  <div class="tab-content">
                    text
                  </div>
                </div>
                <div class="tab">
                  <input class="input56" type="checkbox" id="chck5">
                  <label class="tab-label" for="chck5">Item 3</label>
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


              if (player2?.social?.discord) document.getElementById("click-discord").addEventListener("click", this.copyProfile);
        }

            };
        })(window.BDFDB_Global.PluginUtils.buildPlugin(config));
 })();


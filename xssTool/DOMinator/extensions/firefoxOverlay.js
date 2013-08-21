//                                                                                             
// This code is part of DOMinator Commercial extension
// @Copyright Stefano.dipaola@mindedsecurity.com
// This code is copyrighted
//
Components.utils.import("resource://test_dominatormodules/constants.js"); //
Components.utils.import( DI_const.utilsFile ); 
//Components.utils.import( DI_const.analyzerFile );
//Components.utils.import( DI_const.fuzzCollectFile );
Components.utils.import("resource://gre/modules/AddonUpdateChecker.jsm");

onChangeSources = function DI_OnChangeSources(menuItem){
       DI_Utils.setLogInputsObjPref(menuItem.getAttribute("value"),"taint",menuItem.getAttribute("checked")=="true");
}
  
onSourcePopupShowing= function( ){
        var menu= document.getElementById("DI_sources");
        var items = menu.getElementsByTagName("toolbarbutton");
        var prefObj=DI_Utils.logInputsObjPref;
        for (var i=0; i<items.length; i++)
        {  try{
            var item = items[i];
            if( item.getAttribute("type")!="checkbox"){
             continue;
            } 
            var prefValue = prefObj[item.getAttribute("value")].taint;
            if (prefValue)
                item.setAttribute("checked", "true");
            else
                item.removeAttribute("checked");
           }catch(ee){}
        }
        return true; 
    }

var DOMinatorStart = {
  prefs:null,
  registered:null,
  lc:false,
  onLoad: function() {
    try {  
         try{
            AddonManager.getAddonByID("fxdriver@googlecode.com",
                                                      function(aa){
                                                                   if(aa && aa.isActive){ 
                                                                         dominium(handle.wrappedJSObject); 
                                                                         DI_Utils.hasWebDriver = true;
                                                                    }
                                                               
                                                                })
         
         }catch(ee){alert(ee)} 
/*         if(typeof handle == "undefined"){
          dump("entro");
          handle=''; 
          window.watch("handle",function(o,v,n){
            var ss=n.wrappedJSObject
           
            if(ss && ss.server_ ){
              dominium(ss );
            }
            return n;
          })  
         }else   {
          try{ 
          dominium(handle.wrappedJSObject);
          dump("DONEEEEEE!!!!")
          }catch(e){dump(e+'\n\n\n\n')}
         }
            */
        
         if(!this.lc)
          AddonManager.getAddonByID( DI_const.fullExtName,function(aa){
          
            var dl= DI_Utils.DOMl.getInfos();
            
            var  daysleft=dl?dl.daysleft:0;
            
            var ups=DI_Utils.getup(aa,dl?dl.uuid:null);

            if(!dl){
              alert("You don't have a license ");// da fare un HTML con link per il rinnovo. 
              Firebug.chrome.window.openDialog(DI_const.proFile1, "DOMinator About", "chrome,titlebar,toolbar,centerscreen,modal");
              
            }else if(daysleft<=0){
              
              alert("Your license period has Expired");// da fare un HTML con link per il rinnovo. 
              Firebug.chrome.window.openDialog(DI_const.proFile1, "DOMinator About", "chrome,titlebar,toolbar,centerscreen,modal");
              aa.userDisabled=true;// disabilitiamo tutto.
              var appStartup = Components.interfaces.nsIAppStartup;
              Components.classes["@mozilla.org/toolkit/app-startup;1"]
                 .getService(appStartup).quit(appStartup.eRestart |
                                              appStartup.eAttemptQuit);  
            }else if( daysleft<5){  
              alert("Your copy has "+dl.daysleft+" before expiration");
              Firebug.chrome.window.openDialog(DI_const.proFile1, "DOMinator About", "chrome,titlebar,toolbar,centerscreen,modal") 
            }else{
             this.lc=true;
            }
            
        });
        /*if(DI_Utils.isFirstInstall && typeof Firebug=="undefined"){
          DI_Utils.isFirstInstall=false;
          
          var appStartup = Components.interfaces.nsIAppStartup;
          Components.classes["@mozilla.org/toolkit/app-startup;1"]
              .getService(appStartup).quit(appStartup.eRestart |
                                           appStartup.eAttemptQuit); 
       return;        
        } */
         
        if(window.setToolbarVisibility && document.getElementById("addon-bar").collapsed==true)
         setToolbarVisibility(document.getElementById("addon-bar"), true);
        
        AddonManager.getAddonByID("domintruder@mindedsecurity.com",function(aa){
                                                                   if(!aa)
                                                                    return;
                                                                   if(!aa.userDisabled){ //disable 
                                                                     aa.userDisabled=true;
                                                                    var appStartup = Components.interfaces.nsIAppStartup;
                                                                   Components.classes["@mozilla.org/toolkit/app-startup;1"]
                                                                       .getService(appStartup).quit(appStartup.eRestart |
                                                                                                    appStartup.eAttemptQuit); 
                                                                   }
                                                                  
                                                                });
        
        if(typeof Firebug=="undefined" ){
         try{
            AddonManager.getAddonByID("firebug@software.joehewitt.com",
                                                      function(aa){
                                                                   if(!aa){ //not installed
                                                                      setTimeout(
                                                                         function(){
                                                                               alert("Seems you don't have Firebug installed\nAbout to install Firebug for you");
                                                                               gBrowser.selectedTab = gBrowser.addTab("https://addons.mozilla.org/firefox/downloads/file/150528/firebug-1.9.2-fx.xpi?src=version-history");//https://addons.mozilla.org/firefox/downloads/latest/1843/addon-1843-latest.xpi?src=dp-btn-primary");
                                                                           },1000);
                                                                      return;
                                                                    }
                                                              
                                                                  if(aa.userDisabled){
                                                                    aa.userDisabled=false;
                                                                    var appStartup = Components.interfaces.nsIAppStartup;
                                                                    Components.classes["@mozilla.org/toolkit/app-startup;1"]
                                                                        .getService(appStartup).quit(appStartup.eRestart |
                                                                                                    appStartup.eAttemptQuit); 
                                                                  }
                                                                })
         
         }catch(ee){alert(ee)}
         // return;
        }else{
         try{
         Firebug.PanelActivation.allOn();
         Firebug.Options.set("allPagesActivation", Firebug.allPagesActivation);
         Firebug.PanelActivation.updateAllPagesActivation();
         //Firebug.PanelActivation.toggleAll('on');
         Firebug.getPanelType(DI_const.diMainPanelNameSimple).prototype.setEnabled( true );
         Firebug.getPanelType("script").prototype.setEnabled( true );
         Firebug.getPanelType("console").prototype.setEnabled( true );
         Firebug.chrome.window.document.getElementsByTagName("panelTabMenu")[0].
                    panelBar.updateTab(Firebug.getPanelType("script"))
         Firebug.chrome.window.document.getElementsByTagName("panelTabMenu")[0].
                    panelBar.updateTab(Firebug.getPanelType("console"))
                    }catch(e){}
        }
        
       onSourcePopupShowing();
       this.injectedScript=DI_const.injectedScript;
       const os    = DI_Utils.observerService;
       var test=Cc[ DI_const.wpMonCid ].getService(Ci.nsISupportsWeakReference);
       var test2=Cc[ DI_const.obsCid ].getService(Ci.nsISupports);
       var test3=Cc[ DI_const.remoteAlertCid].getService(Ci.nsISupports);
       this.updateBroadcaster();
       var self=this;
       this.bcPrefListener = new DI_Utils.PrefListener(DI_const.branch.name,
                                  function(branch, name) { 
                                      switch (name) {
                                          case "enabled":
                                              self.toggle();
                                              break;
                                          case "inputPrefsObject":
                                              onSourcePopupShowing();
                                              break;
                                             
                                      }
                                  });
       this.bcPrefListener.register();

       if(this.registered)
        return;
       os.addObserver(this, 'document-element-inserted', false);
       // Analyzer 
      // os.addObserver(this , DI_const.messageInDB, false);
       // collector.register();
       this.registered=true;
     } catch(ee){dumpError(ee,"[EEEEEE] DOMinatorStart");} 
  },
  
  observe : function DI_start(aWindow, aTopic, aData) {

       if( DI_Utils.isEnabled )
        if ( aTopic == 'document-element-inserted' && aWindow.wrappedJSObject && aWindow.wrappedJSObject.defaultView  instanceof Ci.nsIDOMWindow) {
            var doc=aWindow.wrappedJSObject;
            try{
//              setTimeout(function(self){alert(__DI__)/*with(self.defaultView){()}*/},0,doc)
              var hd=null;
              try{
              hd=doc.head; 
              }catch(ee){}finally{if(!hd)hd=doc.getElementsByTagName("head")[0]};
              if(!hd)
               return;
              var a=doc.createElement("script");
              try{
                   a.src=DI_const.ProtoDIScriptInjectFile;
                   a.async=false;
              }catch(ee){
                try{
                  
                  a.setAttribute("src",DI_const.ProtoDIScriptInjectFile); 
                }catch(tt){
                  dumpError(tt,"OOOOOERROR")
                }
              }
              // We need to do this because if there's a not external <script>
              // It'll be the first to be executed, 
              // still we need to find a way to add the last add for event triggering since 
              // onbeforescriptexecute is triggered only by <script .. >.
              hd.setAttribute("onbeforescriptexecute",this.injectedScript);
              if(hd.children.length>0){
                   for(var i=0,l=hd.children.length;i<l;i++){
                     if(hd.children[i] instanceof Ci.nsIDOMHTMLScriptElement){
                       
                       try{
                       var src=hd.children[i].src;
                       }catch(eee){}finally{src=hd.children[i].getAttribute("src")}
                       if( src!='' ){
                          hd.insertBefore(a,hd.children[0]);
                          break;
                       }else{
                         hd.children[i].setAttribute("onbeforescriptexecute",this.injectedScript);
                         break;
                       }
                     }
                   }

                   if(i==l){
                     hd.insertBefore(a,hd.children[0]);
                     var aa=doc.createElement("script");
                     aa.textContent="try{document.head.removeChild(document.currentScript)}catch(ee){}";
                     hd.insertBefore(aa,hd.children[0]); 
                   }
               } else {
                   hd.appendChild(a); 
                   var aa=doc.createElement("script");
                    aa.textContent="try{document.head.removeChild(document.currentScript)}catch(ee){}";
                   hd.appendChild(aa);
                } 
            }catch(err){dumpError(err,"DOMinatorStart.Observe");}
           return; 
        }
        
        if(aTopic == DI_const.messageInDB){
        //  setTimeout(function(){DI_Analyzer.observe(aWindow, aTopic, aData)},0)
        }
    },
/*  onMenuItemCommand: function(e) {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                  .getService(Components.interfaces.nsIPromptService);
    promptService.alert(window, this.strings.getString("helloMessageTitle"),
                                this.strings.getString("helloMessage"));
  },*/
  
  updateBroadcaster: function(){this.toggle(false);},
  
  toggle: function toggle(event){
     try{
      var isEnabled=DI_Utils.isEnabled;
      if(event){ 
       isEnabled=!DI_Utils.isEnabled;
       DI_Utils.setEnabled(isEnabled);
       if(Firebug.getPanelType(DI_const.diMainPanelName)){
         Firebug.getPanelType(DI_const.diMainPanelName).prototype.setEnabled( isEnabled );
         Firebug.chrome.window.document.getElementsByTagName("panelTabMenu")[0].
                    panelBar.updateTab(Firebug.getPanelType(DI_const.diMainPanelName))
       }
      if(Firebug.getPanelType(DI_const.diMainPanelNameSimple)){
         Firebug.getPanelType(DI_const.diMainPanelNameSimple).prototype.setEnabled( isEnabled );
         Firebug.chrome.window.document.getElementsByTagName("panelTabMenu")[0].
                    panelBar.updateTab(Firebug.getPanelType(DI_const.diMainPanelNameSimple))
              }
      }
      

      var broadcaster=document.getElementById(DI_const.broadCasterId); 
      broadcaster.setAttribute("label" ,(isEnabled?"On":"Off"));
      broadcaster.setAttribute("src", (isEnabled?DI_const.imgs.dominatorEnabled:DI_const.imgs.dominatorDisabled)); 
     }catch(exc){dumpError(exc,"[EE]toggle");}
  },
  
  unLoad:function(){ 
    if(!this.registered)
     return;
    const os    = DI_Utils.observerService; 
    os.removeObserver(this, 'document-element-inserted');
    this.bcPrefListener.unregister();
  //  collector.unregister();
    this.registered=false;
  } 
};


window.addEventListener("load", function(e) {  DOMinatorStart.onLoad(e); }, false);
window.addEventListener("unload", function(e) {  DOMinatorStart.unLoad(e); }, false);



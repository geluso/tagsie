/* Bookmarklet code. Paste this within the address bar to run Tagsies within Facebook.
Authors: Steve Geluso, Eric Spishak.

javascript:(function(){
  _my_script=document.createElement('SCRIPT');
  _my_script.type='text/javascript';
  _my_script.src='http://mooncolony.org/js/tagsies.js';
  document.getElementsByTagName('head')[0].appendChild(_my_script);
  setTimeout(function(){tagsies();}, 2000);
})();
*/

function tagsies() {
    alert("Welcome to tagsies!\n\n" +
        
        "Tagsies lets you quickly tag up to 50 friends in a single picture. " +
        "You must refer to friends numerically. Friends are numbered in the order they appear when listed alphabetically " +
        "by their first name then their last name. Aaron Adams would be friend 0.\n\n" +
        
        "Please tag responsibly.");
    var b = function (c,a){PhotoPageTags._replaceTagHtml(a);var e=htmlize(c.getText());var b=htmlize(a.photoOwnerName);var d='';if(a.tag_success){d='<b>';if(!a.tags_need_approval){if(a.user==c.getTaggeeId()){d+=_tx("Tag for yourself saved");}else d+=_tx("Tag for {name} saved",{name:e});}else if(a.user==c.getTaggeeId()){d+=_tx("Tag request for yourself sent to {photo-owner} for approval",{'photo-owner':b});}else d+=_tx("Tag request for {name} sent to {photo-owner} for approval",{name:e,'photo-owner':b});d+='</b>.<br/>';}else d='<b style="color:red">'+_tx("There was an error tagging this photo. Try again later.")+'</b><br />';if(a.invite_sent)d+='<b style="color: green">'+_tx("An invitation and friend request have been sent to {name}",{name:e})+'</b><br/>';if(!a.tags_need_approval){d+=_tx("You can continue to tag the photo below.");}else d+=_tx("You can continue to request tags in the photo below.");d+='<br/>'+_tx("When you are done, click the \"Done Tagging\" button to resume browsing.");hide('tagging_instructions_default_message');DOM.setContent($('tagging_instructions_status_message'),HTML(d));PhotoPageTags.focusInstructions();}
    document.getElementsByClassName("tagging_link")[0].onclick();
    document.getElementById('tagging_instructions_default_message').innerHTML = "<h1>Tagsies is now running.</h1> Please be patient.";
    function click() {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent('click', true, true, window, 1, 593, 261, 591, 145, false, false, false, false, 0, null);
        document.getElementById('myphoto').dispatchEvent(evt);

        function tag() {
            var idRegExp = /setPhotoData\("([0-9]+)", "([0-9]+)"/;
            var matches = idRegExp.exec(document.getElementsByClassName("tagging_link")[0].onclick);
            var id = matches[1];
            var pid = matches[2];

            var qnRegExp = /.setQueueName\(([0-9]+)\)/;
            var qn = qnRegExp.exec(document.getElementsByClassName("tagging_link")[0].onclick)[1];

            var list = document.getElementById("pts_userlist").getElementsByTagName('input');

            var MIN = Math.max(0, prompt("starting index:"));
            var MAX = MIN + Math.min(50, prompt("Tag how many friends? (max 50)"));

            // List of who was tagged.
            var tagged = [];
            for (var i = MIN; i < MAX; i++) {
                var subjectRegExp = /[0-9]+/;
                subject = subjectRegExp.exec(list[i].onclick)[0];
                
                var nameRegExp = /\'(.*)\'/;
                name = nameRegExp.exec(list[i].onclick)[1];
                tagged.push("<li>" + name + "</li>");

                var a = {
                    action: "add",
                    email: "",
                    fb_dtsb: "EUDOX",
                    id: id,
                    lsd: null,
                    name: name,
                    pid: pid,
                    post_form_id: document.getElementById('post_form_id').getAttribute('value'),
                    post_form_id_source: "AsyncRequest",
                    qn: parseInt(qn),
                    scale: 1,
                    source: "photo_php",
                    subject: parseInt(subject),
                    x: 1,
                    y: 1
                };
                //console.log(a);
                new AsyncRequest().setURI(PhotoTag.SYNCING_ENDPOINT).setData(a).setHandler(bind(this,this._submitHandler,b)).setErrorHandler(bind(this,this._submitHandler,b)).setFinallyHandler(bind(this,function(){})).send();
                
            }
            

            setTimeout(function() {
                document.getElementById("cancel").onclick();
                document.getElementById('tagging_instructions_default_message').innerHTML =
                    "<h1>Tagsies requests submitted!</h1>" +
                    ((tagged.length == 0) ? "<p>No friends tagged.</p>" :
                    "<p>Tagged friends " + MIN + " through " + MAX + ": " +
                    "<ul style='list-style-type:square; margin-left: 2em;'>" +
                        tagged.join("") +
                    "</ul></p>" +
                    "<p>Refresh the page to verify results.</p>");
            }, 3000);
        }
        setTimeout(tag, 1000);
    }
    setTimeout(click, 2000);
}
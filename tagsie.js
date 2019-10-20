/* Bookmarklet code. Navigate to any photo on Facebook where you can tag someone.
   Paste this within the address bar to load Tagsie.
    
   Especially useful for spamming friends' profiles with banners, a la
   http://i.imgur.com/YeyxG.png
    
   Authors: Steve Geluso, Eric Spishak.

javascript:(function(){
  _my_script=document.createElement('SCRIPT');
  _my_script.type='text/javascript';
  _my_script.src='http://mooncolony.org/js/tagsie.js';
  document.getElementsByTagName('head')[0].appendChild(_my_script);
  setTimeout(function(){tagsie();}, 2000);
})();
*/

function tagsie() {
    // Display patient text.
    document.getElementById('tagsiestatus').innerHTML = "<p>Tagsie is now running. Please be patient.</p>";

    
    var idRegExp = /setPhotoData\("([0-9]+)", "([0-9]+)"/;
    var matches = idRegExp.exec(document.getElementsByClassName("tagging_link")[0].onclick);
    var id = matches[1];
    var pid = matches[2];

    var qnRegExp = /.setQueueName\(([0-9]+)\)/;
    var qn = qnRegExp.exec(document.getElementsByClassName("tagging_link")[0].onclick)[1];

    var list = document.getElementById("pts_userlist").getElementsByTagName('label');

    var MIN = Math.max(0, parseInt(document.getElementById("tagsiemin").value), 0);
    var MAX = Math.min(MIN + 50, parseInt(document.getElementById("tagsiemax").value));
    
    // List of who was tagged.
    var tagged = [];
    for (var i = MIN; i < MAX; i++) {
        var subjectRegExp = /[0-9]+/;
        subject = subjectRegExp.exec(list[i].children[0].onclick)[0];
        
        var nameRegExp = /\'(.*)\'/;
        name = nameRegExp.exec(list[i].children[0].onclick)[1];
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
        document.getElementById('tagsiestatus').innerHTML =
            "<h1>Tagsie requests submitted!</h1>" +
            ((tagged.length == 0) ? "<p>No friends tagged.</p>" :
            "<p>Tagged friends " + MIN + " through " + MAX + ": " +
            "<ul style='list-style-type:square; margin-left: 2em;'>" +
                tagged.join("") +
            "</ul></p>" +
            "<p>Refresh the page to verify results.</p>");
    }, 3000);
}

// add numbers to the friends list.
function number() {
    var list = document.getElementById("pts_userlist").getElementsByTagName('label');
    // number the list to make decisions easier.
    for (var i = 0; i < list.length; i++) {
        list[i].innerHTML += "<div style='float:right; color:#0000dd;'>" + i + "</div>";
    }
}

// simulate a mouse click to bring up the regular tagger.
function init() {    
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent('click', true, true, window, 1, 593, 261, 800, 145, false, false, false, false, 0, null);
    document.getElementById('myphoto').dispatchEvent(evt);
    setTimeout(number, 1000);
}

var b = function (c,a){PhotoPageTags._replaceTagHtml(a);var e=htmlize(c.getText());var b=htmlize(a.photoOwnerName);var d='';if(a.tag_success){d='<b>';if(!a.tags_need_approval){if(a.user==c.getTaggeeId()){d+=_tx("Tag for yourself saved");}else d+=_tx("Tag for {name} saved",{name:e});}else if(a.user==c.getTaggeeId()){d+=_tx("Tag request for yourself sent to {photo-owner} for approval",{'photo-owner':b});}else d+=_tx("Tag request for {name} sent to {photo-owner} for approval",{name:e,'photo-owner':b});d+='</b>.<br/>';}else d='<b style="color:red">'+_tx("There was an error tagging this photo. Try again later.")+'</b><br />';if(a.invite_sent)d+='<b style="color: green">'+_tx("An invitation and friend request have been sent to {name}",{name:e})+'</b><br/>';if(!a.tags_need_approval){d+=_tx("You can continue to tag the photo below.");}else d+=_tx("You can continue to request tags in the photo below.");d+='<br/>'+_tx("When you are done, click the \"Done Tagging\" button to resume browsing.");hide('tagging_instructions_default_message');DOM.setContent($('tagging_instructions_status_message'),HTML(d));PhotoPageTags.focusInstructions();}
document.getElementsByClassName("tagging_link")[0].onclick();

setTimeout(init, 2000);

// Display Tagsie welcome.
document.getElementById('tagging_instructions_default_message').innerHTML =     
    "<h1>Welcome to Tagsie!</h1>" +
    
    "<div id='tagsiestatus'>" +
        "<p>Tagsie lets you quickly tag up to 50 friends in a single picture." +
        "Simply specificy the range of friends you want to tag and let Tagsie do all the work!</p>" +
        
        "<p>You must refer to friends numerically." +
        "Browse through your list of friends to see how they are numbered, but be careful not to click" +
        "on a friend\'s name within the regular Facebook tagger or the Tagsie Process may be ruined. " +
        "It is safe to press \'cancel\' to get rid of the original tagger if it is in your way." +
        
        "<p>Please tag responsibly.</p>" +
    "</div>" +

    "<p>Tag from friend #" +
        "<label>" +
            "<input id='tagsiemin' value='0' size='5' type='input'>" +
        "</label>" +
        "up to #" +
        "<label>" +
            "<input id='tagsiemax' value='50' size='5' type='input'>" +
        "</label>" +
        "&nbsp;(max difference 50)" +
    "</p>" +
    
    "<div id='tagsiecontrol'>" +
        "<label class='caption_save uiButton' id='runtagsie'>" +
            "<input value='Run Tagsie' onclick='tagsie();' type='submit'>" +
        "</label>" +
    "</div>";
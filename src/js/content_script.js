var responder = false;
var overlay = document.createElement('div');
var targetSize = 400;

overlay.setAttribute('id', 'chrome-nuke-overlay');
document.body.appendChild(overlay);

function onOverlayClick(e) {
    console.log('Overlay clicked.');

    e.preventDefault();
    e.stopPropagation();

    overlay.classList.remove('active');

    setTimeout(function() {
        console.log('Target timeout activated.');

        var targets = document.elementsFromPoint(e.pageX - document.body.scrollLeft, e.pageY - document.body.scrollTop);

        overlay.classList.add('active');

        if(targets && targets.length) {
            targets.filter(function(target) {
                return ['html', 'body'].indexOf(target) === -1;
            });

            targets.sort(function(a, b) {
                return a.offsetWidth - b.offsetWidth;
            });

            console.log(targets);

            for(var i = 0; i < targets.length; i++) {
                console.log(targets[i].offsetWidth);
                console.log(targets[i].offsetHeight);
                if(targets[i].offsetWidth >= targetSize && targets[i].offsetHeight >= targetSize) {
                    break;
                }
            }

            if(i !== targets.length) {
                if(i === 0) {
                    i = 1;
                }

                targets.splice(i, targets.length - (i - 1));
            }

            console.log(targets);

            responder({href: window.location.href, targets: targets});
            console.log('Extension message sent.');
            
            var fire = document.createElement('img');
            var fireWidth = 75;
            var fireHeight = 179;

            fire.style.setProperty('position', 'absolute');
            fire.style.setProperty('top', (e.pageY - fireHeight) + 'px');
            fire.style.setProperty('left', (e.pageX - fireWidth / 2) + 'px');
            fire.style.setProperty('width', fireWidth + 'px');
            fire.style.setProperty('height', fireHeight + 'px');
            fire.style.setProperty('z-index', '999999');

            fire.setAttribute('src', chrome.extension.getURL('img/fire.gif'));

            document.body.appendChild(fire);
            console.log('Explosion animation initialized.');

            setTimeout(function() {
                var targetsLength = targets.length;

                for(var i = 0; i < targetsLength; i++) {
                    var target = targets[i];

                    target.parentNode.removeChild(target);
                }

                fire.parentNode.removeChild(fire);
                overlay.classList.remove('active');
                console.log('Target and animation removed.');
            }, 1000);
        }
    }, 0);

    overlay.removeEventListener('click', onOverlayClick, false);
}

function arm() {
    overlay.classList.add('active');
    overlay.addEventListener('click', onOverlayClick, false);
    overlay.focus();
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.action) {
        case 'arm':
            arm();
            break;
    }

    responder = sendResponse;
});

chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
    alert(request);
    if(request.action === 'arm') {
        arm();
    }

    sendResponse();
});

var responder = false;
var overlay = document.createElement('div');
var targetSize = 400;

overlay.setAttribute('id', 'chrome-nuke-overlay');
document.body.appendChild(overlay);

function animateFire(x, y) {
    var fire = document.createElement('div');
    var fireSizeRandom = Math.floor(Math.random() * 50 - 25);
    var fireWidth = 75 + fireSizeRandom;
    var fireHeight = 179 + fireSizeRandom;

    fire.classList.add('chrome-nuke-fire');

    fire.style.width = fireWidth + 'px';
    fire.style.height = fireHeight + 'px';
    fire.style.top = (y - fireHeight) + 'px';
    fire.style.left = (x - fireWidth / 2) + 'px';
    fire.style.zIndex = 999999 + y;
    
    document.body.appendChild(fire);
    console.log('Explosion animation initialized.');

    var frame = 1;

    var doFireFrame = function() {
        var frameString = frame.toString();

        if(frameString.length === 1) {
            frameString = '0' + frameString;
        }

        fire.style.backgroundImage = 'url(' + chrome.extension.getURL('img/fire/fire-' + frameString + '.png') + ')';

        frame++;

        if(frame > 24) {
            fire.parentNode.removeChild(fire);
        } else {
            console.log('Fire animation removed.');
            setTimeout(doFireFrame, 1000 / 24);
        }
    };

    doFireFrame();

    var targets = getTargetsAt(x, y);
    var targetsLength = targets.length;

    for(var i = 0; i < targetsLength; i++) {
        var target = targets[i];

        if(target.parentNode) {
            console.log(target);
            target.parentNode.removeChild(target);
        }
    }

    overlay.classList.remove('active');
    console.log('Target removed.');
}

function getTargetsAt(x, y) {
    var targets = document.elementsFromPoint(x, y);

    if(targets && targets.length) {
        targets = targets.filter(function (target) {
            return ['HTML', 'BODY'].indexOf(target.tagName) === -1 && !target.classList.contains('chrome-nuke-fire');
        });

        targets.sort(function (a, b) {
            return a.offsetWidth - b.offsetWidth;
        });

        console.log(targets);

        for (var i = 0; i < targets.length; i++) {
            if (targets[i].offsetWidth >= targetSize && targets[i].offsetHeight >= targetSize) {
                break;
            }
        }

        if (i !== targets.length) {
            if (i === 0) {
                i = 1;
            }

            targets.splice(i, targets.length - (i - 1));
        }
    }

    console.log(targets);

    if(!targets) {
        targets = [];
    }

    return targets;
}

function onOverlayClick(e) {
    console.log('Overlay clicked.');

    e.preventDefault();
    e.stopPropagation();

    overlay.classList.remove('active');
    overlay.removeEventListener('click', onOverlayClick, false);

    setTimeout(function() {
        console.log('Target timeout activated.');

        var type = overlay.getAttribute('data-type');

        switch(type) {
            case 'cluster':
                var ySpread = 100;
                var xStep = 25;
                var radius = 100;
                var xCenter = 0;
                var yCenter = e.pageY - document.body.scrollTop;
                var bombDelay = 100;
                var bombDelayRandom = 25;

                var nextBomb = function() {
                    var x = xCenter + Math.floor(Math.random() * radius) - (radius / 2);
                    var y = yCenter + Math.floor(Math.random() * radius) - (radius / 2);

                    animateFire(x, y);

                    xCenter += xStep;

                    if(xCenter < window.innerWidth) {
                        setTimeout(nextBomb, bombDelay + Math.floor(Math.random() * bombDelayRandom) - bombDelayRandom / 2);
                    }
                };

                nextBomb();

                break;
            case 'single':
            default:
                var x = e.pageX - document.body.scrollLeft;
                var y = e.pageY - document.body.scrollTop;
                var targets = getTargetsAt(x, y);

                responder({href: window.location.href, targets: targets});
                animateFire(x, y);

                break;
        }
    }, 0);
}

function arm(type) {
    overlay.classList.add('active');
    overlay.addEventListener('click', onOverlayClick, false);
    overlay.setAttribute('data-type', type);
    overlay.focus();
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);

    switch(request.action) {
        case 'arm':
            arm(request.type);
            break;
    }

    responder = sendResponse;
});


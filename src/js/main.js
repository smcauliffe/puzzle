

var app = function() {
  // http://stackoverflow.com/questions/27065230/how-to-split-up-an-image-in-pieces-and-reshuffle-it-using-html-javascript-or-c

  var container = document.getElementById('image-container');
  var pieceWidth, pieceHeight;
  container.innerHTML = '';

  var rows=3;
  var cols=3;

  var img=new Image();
  img.onload=start;
  img.src = document.getElementsByTagName('input')[0].value;
  function start(){

    var iw=img.width;
    var ih=img.height;
    pieceWidth=iw/cols;
    pieceHeight=ih/rows;

    document.querySelector('#image-container').style.width = iw + 10 + 'px';
    document.querySelector('#image-container').style.height = ih + 10 + 'px';

    var pieces = [
      {col:0,row:0},
      {col:1,row:0},
      {col:2,row:0},
      {col:0,row:1},
      {col:1,row:1},
      {col:2,row:1},
      {col:0,row:2},
      {col:1,row:2},
      {col:2,row:2}
    ];
    shuffle(pieces);

    var i=0;
    for(var y=0;y<rows;y++){
      for(var x=0;x<cols;x++){
        var p=pieces[i++];
        var c = document.createElement('canvas');
        Cctx = c.getContext("2d");
        c.width = pieceWidth;
        c.height = pieceHeight;
        Cctx.drawImage(
          // from the original image
          img,
          // source coordinates and sizes
          p.col*pieceWidth, p.row*pieceHeight, pieceWidth, pieceHeight,
          // destination coordinates and sizes
          0, 0, pieceWidth, pieceHeight
        );
        document.querySelector('#image-container').appendChild(c);
      }}

    interact('canvas')
      .draggable({
        inertia: true,
        restrict: {
          restriction: '#image-container',
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        onmove: function(event) {
          var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

          target.style.transform =
            'translateX(' + x + 'px)' +
            'translateY(' + y + 'px)';
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);

          markDropTarget(event.target);
        }
      })
      .on('dragstart', function(event) {
        event.target.className = 'dragged';
      })
      .on('dragend', function(event) {
        if (document.querySelector('.target')) {
          var all = document.getElementById('image-container'),
            targetIndex = _.indexOf(all.children, document.getElementsByClassName('target')[0]),
            draggedIndex = _.indexOf(all.children, document.getElementsByClassName('dragged')[0]);

          var targetCopy = all.children[targetIndex];

          all.replaceChild(all.children[draggedIndex], all.children[targetIndex]);
          all.insertBefore(targetCopy, all.children[draggedIndex]);

        }
        event.target.className = 'not-dragged';
        _.each(document.querySelectorAll('canvas'), function(item) {
          item.className = '';
          item.removeAttribute('data-x');
          item.removeAttribute('data-y');
          item.style.transform =
            'translateX(0)' +
            'translateY(0)';
        });
      })
      .dropzone({
        accept: '.target'
      })
      .resizable({
        inertia: true
      });

  }

  function markDropTarget(draggedEl) {
    var all = document.querySelectorAll('canvas:not(.dragged)');
    _.each(all, function(item) {
      var draggedElRect = draggedEl.getBoundingClientRect(),
          thisRect = item.getBoundingClientRect(),
          toleranceX = pieceWidth * .5,
          toleranceY = pieceHeight * .5;

      item.className = '';

      if (Math.abs(draggedElRect.top - thisRect.top) < toleranceY &&
          Math.abs(draggedElRect.bottom - thisRect.bottom) < toleranceY &&
          Math.abs(draggedElRect.left - thisRect.left) < toleranceX &&
          Math.abs(draggedElRect.right - thisRect.right) < toleranceX ) {

        item.className = 'target';

      }
    });
  }

  function shuffle(a){
    for(var j, x, i = a.length; i; j = Math.floor(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x);
    return a;
  }

};

app();

function resetImage() {
  console.log('change');
  app();
}
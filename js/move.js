var flag = false;
var cur = {
    x:0,
    y:0
}
var nx,ny,dx,dy,x,y ;
function down(ev){
    flag = true;
    var touch ;
    if(event.touches){
        touch = event.touches[0];
    }else {
        touch = event;
    }
    cur.x = touch.clientX;
    cur.y = touch.clientY;
    dx = ev.offsetLeft;
    dy = ev.offsetTop;
}
function move(ev){
    if(flag){
        var touch ;
        if(event.touches){
            touch = event.touches[0];
        }else {
            touch = event;
        }
        nx = touch.clientX - cur.x;
        ny = touch.clientY - cur.y;
        x = dx+nx;
        y = dy+ny;
        console.log(x,y);
        if(x < 0){
            x = 0;
        }
        else if (x > document.documentElement.clientWidth - ev.offsetWidth) {
            x = document.documentElement.clientWidth - ev.offsetWidth;
        }
        if( y < 0){
            y = 0;
        }
        else if(y > document.documentElement.clientHeight - ev.offsetHeight){
            y = document.documentElement.clientHeight - ev.offsetHeight;
        }
        ev.style.left = x+"px";
        ev.style.top = y +"px";
        // //阻止页面的滑动默认事件
        // document.addEventListener("touchmove",function(){
        //     event.preventDefault();
        // },false);
    }
}
function end(){    
    flag = false;
}
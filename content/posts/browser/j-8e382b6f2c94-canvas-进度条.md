---
title: "canvas-进度条"
date: 2018-12-07
slug_jianshu: 8e382b6f2c94
tags: ["Canvas"]
state: open
source: "https://www.jianshu.com/p/8e382b6f2c94"
source_kind: jianshu
---
```
drawMain(canvas, 0.2, 70, "#64C8C8", "#D0EEEE")
    drawMain(drawing_elem, ratio, percent, forecolor, bgcolor) {
        /*
            @drawing_elem: 绘制对象
            @ratio: canvas和屏幕的宽度的比例
            @percent：绘制圆环百分比, 范围[0, 100]
            @forecolor: 绘制圆环的前景色，颜色代码
            @bgcolor: 绘制圆环的背景色，颜色代码
        */
        drawing_elem.width = window.screen.width * ratio * window.devicePixelRatio
        drawing_elem.height = window.screen.width * ratio * window.devicePixelRatio
        var context = drawing_elem.getContext("2d");
        var center_x = drawing_elem.width / 2;
        var center_y = drawing_elem.height / 2;
        var rad = Math.PI*2/100; 
        var speed = 0;
        
        // 绘制背景圆圈
        function backgroundCircle(){
            context.save();
            context.beginPath();
            context.lineWidth = 4 * window.devicePixelRatio; //设置线宽
            var radius = center_x - context.lineWidth;
            context.lineCap = "round";
            context.strokeStyle = bgcolor;
            context.arc(center_x, center_y, radius, 0, Math.PI*2, false);
            context.stroke();
            context.closePath();
            context.restore();
        }

        //绘制运动圆环
        function foregroundCircle(n){
            context.save();
            context.strokeStyle = forecolor;
            context.lineWidth = 4 * window.devicePixelRatio;
            context.lineCap = "round";
            var radius = center_x - context.lineWidth;
            context.beginPath();
            context.arc(center_x, center_y, radius , -Math.PI/2, -Math.PI/2 +n*rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
            context.stroke();
            context.closePath();
            context.restore();
        }

        // 绘制文字
        function textNum(){
          context.save();  //save和restore可以保证样式属性只运用于该段canvas元素
          context.fillStyle = forecolor;
          var font_size = 17 * window.devicePixelRatio;
          context.font = font_size + "px Helvetica";
          context.fillText(17+'/'+30, center_x*0.5, center_y);
          context.restore();
          console.log(2)
        }
        // 绘制
        function textDesc(){
          context.save();  //save和restore可以保证样式属性只运用于该段canvas元素
          context.fillStyle = '#A9A9A9';
          var font_size = 12 * window.devicePixelRatio;
          context.font = font_size + "px Helvetica";
          context.fillText('还需'+(30-17)+'天', center_x*0.38, center_y + font_size);
          context.restore();
          console.log(1)
        }

        //执行动画
        (function drawFrame(){
            if(speed >= percent) {
              return
            }else {
              speed += 1
            }
            window.requestAnimationFrame(drawFrame);
            context.clearRect(0, 0, drawing_elem.width, drawing_elem.height);
            backgroundCircle();
            textNum();
            textDesc()
            foregroundCircle(speed); 
        }());
    },
```

var randomColor = function(){
    var min = 100;
    var r = Math.floor(Math.random() * (256 - min) + min);
    var g = Math.floor(Math.random() * (256 - min) + min);
    var b = Math.floor(Math.random() * (256 - min) + min);
    return {r:r, g:g, b:b};
};

$(function(){
    var width = $('#canvas').width();
    var height = $('#canvas').height();
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var rate = 60;
    var gravity = 0.01;

    var drawPoint = function(x, y, color, alpha){
        ctx.beginPath();
        ctx.fillStyle = 'rgba('+color.r+','+color.g+','+color.b+','+alpha+')'; // 赤
        ctx.arc(x, y, 2.5, 0, Math.PI * 2, false);
        ctx.fill();
    };

    var sparkNum = 64;

    var Hanabi = function(){
        this.x = width * Math.random();
        this.y = height;
        this.maxY = 200 + 350 * Math.random();
        this.vy = - Math.sqrt(2 * gravity * this.maxY);
        this.radius = 0;
        this.maxRadius = 100 + 400 * Math.random();
        this.explodeSpeed = 5.0/rate;
        this.colorNum = 4;
        this.colors = new Array(this.colorNum);
        this.alpha = 1.0;
        this.finish = false;
        for(var i = 0; i < this.colorNum; i++){
            this.colors[i] = randomColor();
        }
        this.explodeCounter = 0;
    };

    Hanabi.prototype.update = function(){
        this.vy += gravity;
        this.y += this.vy;
        if(this.explodeCounter == 0){
            if(this.vy >= 0){
                this.explodeCounter++;
                this.alpha = 1.0;
            }
        }else{
            this.radius = this.maxRadius *(
                1.0 - Math.pow(Math.E, -this.explodeSpeed * this.explodeCounter)
            );
            this.explodeCounter++;
            this.alpha *= 0.99;
            if(this.y > height + this.maxRadius){
                this.finish = true;
                console.log("this.finish: " + this.finish);
            }
        }
    };

    Hanabi.prototype.draw = function(){
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(255, 0, 0, 0.50)';
        if(this.explodeCounter == 0){
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }else{
            for(var col = 0; col < this.colorNum; col++){
                var radius = this.radius * ((col - 0.3) / this.colorNum);
                var num = sparkNum * col / this.colorNum;
                var color = this.colors[col];
                for(var i = 0; i < num; i++){
                    var x = this.x + radius * Math.cos(i * 2 * Math.PI / num);
                    var y = this.y + radius * Math.sin(i * 2 * Math.PI / num);
                    drawPoint(x, y, color, this.alpha);
                }
            }
        }
    };

    var hanabis = new Array();
    var counter = 0;
    var loop = function(){
        if(counter == 0){
            hanabis.push(new Hanabi);
            counter = Math.floor(Math.random() * 5 * rate);
        }
        counter--;

        ctx.fillStyle = 'rgb(0, 0, 48)';
        ctx.fillRect(0, 0, width, height);

        for(var i = 0, len = hanabis.length; i < len; i++){
            hanabi = hanabis[i];
            hanabi.update();
            hanabi.draw();
        }
        for(var i = 0; i < hanabis.length; i++){
            if(hanabis[i].finish){
                hanabis.splice(i, 1);
                i--;
            }
        }
        setTimeout(loop, 1000/rate);
    };
    loop();
});
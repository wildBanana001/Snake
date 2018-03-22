var snakeGame = {
	score : document.getElementsByTagName('i')[0],
	//创建地图
	createMap : function(reopen) {
		var oDiv = document.getElementsByTagName('div')[1];
		oDiv.className = 'wrapper';
		var oTable = document.createElement('table');
		var oTbody = document.createElement('tbody');
		this.rowNum = 24;
		this.colNum = 40;
		this.oSnake = [];
		if(reopen === 'reopen') {
			oDiv.removeChild(oTable);
		}
		for(var i = 0; i < this.rowNum; i++) {
			var oTr = document.createElement('tr');
			var tempArr = [];
			for(var j = 0; j < this.colNum; j++) {
				var oTd = document.createElement('td');
				oTd.className = '';
				oTr.appendChild(oTd);
				tempArr.push(oTd);
			}
			oTbody.appendChild(oTr);
			this.oSnake.push(tempArr);
		}
		oTable.appendChild(oTbody);
		oDiv.appendChild(oTable);
		return this;
	},
	//创建初始蛇
	snake : function() {
		this.snakeBody = [];
		for(var i = 0; i < 3; i++) {
			this.snakeBody[i] = this.oSnake[0][i];
			this.oSnake[0][i].className = 'snakes';
		}
		return this;
	},
	//随机食物
	food : function() {
		this.foodY = Math.floor(Math.random() * this.rowNum);
		this.foodX = Math.floor(Math.random() * this.colNum);
		if(this.oSnake[this.foodY][this.foodX].className == 'snakes') {
			this.food();
		}else {
			this.oSnake[this.foodY][this.foodX].className = 'foods';
		}
		return this;
	},
	//设定方向
	setDirect : function(code) {
		if(!this.flag) {
			return;
		}
		if(this.direct == 'left' && code == 37){
			return;
		}
		if(this.direct == 'up' && code == 38){
			return;
		}
		if(this.direct == 'right' && code == 39){
			return;
		}
		if(this.direct == 'down' && code == 40){
			return;
		}
		//反方向按键致死BUG
		if(this.direct == 'left' && code == 39){
			return;
		}
		if(this.direct == 'up' && code == 40){
			return;
		}
		if(this.direct == 'right' && code == 37){
			return;
		}
		if(this.direct == 'down' && code == 38){
			return;
		}
		switch(code) {
            case 37:
                this.direct='left';
                break;
            case 38:
                this.direct='up'; 
                break;
            case 39:
                this.direct='right';
                break;
            case 40:
                this.direct='down';
                break;
            default :
            	break;
        }
        //防止按键速度过快出现BUG
        this.flag = false;
        this.timeOut = setTimeout(function() {
        	this.flag = true;
        }, 100);
	},
	//移动
	move : function(speed) {
		this.direct = 'right';
		clearInterval(this.timerMove);
		//蛇头坐标
		this.disY = 0;
		this.disX = 2;
		//计分
		this.count = 0;
		this.timerMove = setInterval(() => {
			this.snakeMove();
		}, speed);
	},
	snakeMove : function() {
		clearTimeout(this.timeOut);
	  	this.flag = true;
	  	switch(this.direct) {
	  		case 'left' :
	  			this.disX--;
	  			break;
	  		case 'up' :
	  			this.disY--;
	  			break;
	  		case 'right' :
	  			this.disX++;
	  			break;
	  		case 'down' :
	  			this.disY++;
	  			break;
	  	}
	  	//撞墙死
	  	if(this.disX < 0 || this.disY < 0 || this.disX >= this.colNum || this.disY >= this.rowNum) {
	  		clearInterval(this.timerMove);
	  		alert('you dead!!!');
	  		return;
	  	}
	  	//蛇碰到自己
	  	for(var i = 0; i < this.snakeBody.length; i++) {
	  		if (this.snakeBody[i] == this.oSnake[this.disY][this.disX]) {
	  			clearInterval(this.timerMove);
	  			alert('you eat youself, so stupid!');
	  			return;
	  		}
	  	}
	  	//吃到食物
	  	if(this.foodY === this.disY && this.foodX === this.disX) {
	  		this.oSnake[this.disY][this.disX].className = 'snakes';
	  		this.snakeBody.push(this.oSnake[this.disY][this.disX]);
	  		this.count++;
	  		this.score.innerHTML = this.count;
	  		this.food();
	  	}else {
	  		this.snakeBody[0].className = '';
	  		this.snakeBody.shift();
	  		this.oSnake[this.disY][this.disX].className = 'snakes';
	  		this.snakeBody.push(this.oSnake[this.disY][this.disX]);
	  	}
	}

}

window.onload = function() {
	snakeGame.createMap().snake().food();
	bindEvent();
}
function bindEvent() {
	var oSpanArr = document.getElementsByTagName('span');
	var flag1 = false;
	var speed = 0;
	//开始
	oSpanArr[0].onclick = function() {
		if (!flag1) {
			alert('请先选择难度！');
		}else {
			snakeGame.snake().move(speed);
		}
	};
	//暂停
	oSpanArr[1].onclick = function() {
		 alert('暂停中！点击确定继续游戏！');
	};
	//简单
	oSpanArr[2].onclick = function() {
		speed = 300;
		flag1 = true;
	};
	//困难
	oSpanArr[3].onclick = function() {
		speed = 100;
		flag1 = true;
	};
	//魔鬼
	oSpanArr[4].onclick = function() {
		speed = 20;
		flag1 = true;
	};
	oSpanArr[5].onclick = function() {
		 speed = window.prompt('请输入你想要的速度，越小越快！');
		 flag1 = true;
	};
	document.onkeydown = function() {
		var code;
		if(window.event) {
			code = window.event.keyCode;
		}else {
			code = event.keyCode;
		}
		snakeGame.setDirect(code);
	}
}


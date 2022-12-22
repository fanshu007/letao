// 1.loading动态图加载...

    initLoading();
    function initLoading(){
        
		var canvas = document.getElementById("loading1"),
				ctx = canvas.getContext("2d"),
				w = canvas.width,
				h = canvas.height,
				x = w / 2,
				y = h / 2,
				radius = 30;
			ctx.fillStyle = "#ccc";
			ctx.fillRect(0, 0, w, h);

			var r = [3, 4, 4.5, 5, 6, 7];
			var angle = [10, 25, 45, 65, 90, 120];
			var alpha = [0.25, 0.35, 0.45, 0.65, 0.8, 1];
			var x1 = [], y1 = [];

			setInterval(function () {
				ctx.fillStyle = "#ccc";
				ctx.fillRect(0, 0, w, h);
				x1 = [];
				y1 = [];
				for (var i = 0; i < r.length; i++) {
					if (angle[i] >= 360) angle[i] = 0;
					ctx.beginPath();
					ctx.font = "1rem sans-serif";
					ctx.fillStyle = "rgba(255,20,147," + alpha[i] + ")";
					x1.push(x + radius * Math.cos(angle[i] * Math.PI / 180));
					y1.push(y + radius * Math.sin(angle[i] * Math.PI / 180));
					ctx.arc(x1[i], y1[i], r[i], 0, 2 * Math.PI, true);
					ctx.closePath();
					ctx.fill();
					angle[i] += 5;
				}
			}, 15);

    }
  // 2.正则匹配获取----如果有多个参数 并且是无序的,用正则会更严谨...
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return decodeURI(r[2]);
    }
    return null;
  }









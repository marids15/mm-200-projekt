var canvas; 
	//window.newAnimation = function(){
	   canvas = new fabric.Canvas('canvas');
	//}

	window.print = function(){
	  console.log(canvas.getActiveObject()); 
	  //console.log(canvas.getObjects()); 
	};

	window.addRect = function(){
	    var rect = new fabric.Rect({
	  left: 100,
	  top: 100,
	  fill: 'red',
	  width: 20,
	  height: 20,
	});
	    canvas.add(rect);

	}

	window.addCircle = function(){
	    var circle = new fabric.Circle({
	  radius: 20, fill: 'green', left: 100, top: 100
	});
	    canvas.add(circle);
	}

	window.deleteObject = function() {
	        canvas.getActiveObject().remove();
	}  

	canvas.on('object:moving', function (e) {
		var obj = e.target;
		console.log("inside");
		console.log(obj.getBoundingRect());
        
         // if object is too big ignore
        if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
            return;
        }        
        obj.setCoords();        
        // top-left  corner
        if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
            obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
            obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
            //console.log("11111     "+obj.top+"   "+obj.left);
        }
        // bot-right corner
        if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
            obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
            obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
            //console.log("22222b     "+obj.top+"   "+obj.left);
        }
});

canvas.on('object:scaling', function (e) {
		var obj = e.target;
		console.log("inside scaling");
		console.log("top  "+obj.getBoundingRect().top);
		console.log("left  "+obj.getBoundingRect().left);
		console.log("Height  "+obj.getBoundingRect().height);
		console.log("width  "+obj.getBoundingRect().width);
		console.log("top  "+obj.top);
		console.log("left  "+obj.left);
		obj.setCoords();
		if(obj.getBoundingRect().left < 0 || (obj.getBoundingRect().left+obj.getBoundingRect().width)>obj.canvas.width){
			console.log("inside left <0");
			obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
			//obj.width=
			//obj.getBoundingRect().width=
		}
    obj.getBoundingRecta8()
		/*if(obj.left < 0 || (obj.left+obj.getBoundingRect().width)>obj.canvas.width){
			obj.getBoundingRect().left=0;
			obj.getBoundingRect().width=obj.canvas.width;
			obj.setCoords();

		}

		if(obj.top < 0 || (obj.top+obj.getBoundingRect().height)>obj.canvas.height){
			obj.getBoundingRect().top=0;
			obj.getBoundingRect().height=obj.canvas.height;
		obj.setCoords();

		}
        
         // if object is too big ignore
        if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
            return;
        }        
        obj.setCoords();        
        // top-left  corner
        if(obj.getBoundingRect().width < obj.canvas.width){
            obj.width = Math.max(obj.width, obj.width-obj.getBoundingRect().width);
            obj.height = Math.max(obj.height, obj.height-obj.getBoundingRect().height);
            //console.log("11111     "+obj.top+"   "+obj.left);
        }
        if(obj.getBoundingRect().height < obj.canvas.height){
        	obj.width = Math.max(obj.width, obj.width-obj.getBoundingRect().width);
            obj.height = Math.max(obj.height, obj.height-obj.getBoundingRect().height);
        }
        // bot-right corner
        if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
            obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
            obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
            //console.log("22222b     "+obj.top+"   "+obj.left);
        }*/
///<reference path=".\TSDef\p5.global-mode.d.ts" />

let smoothControl;
let img;
function preload() {
  img = loadImage('assets/2021-slalom.png');
}
function setup() {
  image(img, 0, 0);
}

function setup() 
{
	createCanvas(800, 420);
  	smoothControl = new SmoothControlPath();
}

function draw()
{
	background(220);
	drawGrid();
	image(img, 0, 0);
	smoothControl.draw();
}

function drawGrid() 
{
	stroke(200);
	fill(120);
	for (var x=-width; x < width; x+=40) {
		line(x, -height, x, height);
		text(x, x+1, 12);
	}
	for (var y=-height; y < height; y+=40) {
		line(-width, y, width, y);
		text(y, 1, y+12);
	}
}

function mousePressed()
{
	smoothControl.addOrSelect(mouseX, mouseY);
}

function mouseDragged()
{
	smoothControl.updatePose(mouseX, mouseY);
}

function keyPressed() 
{
	if (keyCode === DELETE) 
	{
		smoothControl.deletePose();
	}
}

class Pose
{
	constructor(x, y, headingRadians, velocity)
	{
		this.triangleWidth = 20;
		this.triangleHeight = 40;
		this.arrowBrightness = 0;
		this.triangleBrightness = 0;
		this.position = createVector(x,y);
		this.v = fromAngle(headingRadians);
		this.v.setMag(velocity);
	}

	isWithinTriangle(x, y)
	{
		let x = this.position.x;
		let y = this.position.y;
		let theta = v.heading();
		let y1 = (y + (this.triangleHeight/2)) * Math.cos(theta) - (x - (this.triangleWidth/2)) * Math.sin(theta) + centerY;
		let x1 = (y + (this.triangleHeight/2)) * Math.sin(theta) + (x - (this.triangleWidth/2)) * Math.cos(theta) + centerX;

		let y2 = (y + (this.triangleHeight/2)) * Math.cos(theta) - (x + (this.triangleWidth/2)) * Math.sin(theta) + centerY;
		let x2 = (y + (this.triangleHeight/2)) * Math.sin(theta) + (x + (this.triangleWidth/2)) * Math.cos(theta) + centerX;

		let y3 = (y - this.triangleHeight/2) * Math.cos(theta) - x * Math.sin(theta) + centerY;
		let x3 = (y - this.triangleHeight/2) * Math.sin(theta) + x * Math.cos(theta) + centerX;

		// get the area of the triangle
		let areaOrig = Math.abs((x2-x1)*(y3-y1) - (x3-x1)*(y2-y1));

		// get the area of 3 triangles made between the point
		// and the corners of the triangle
		let area1 = Math.abs( (x1-px)*(y2-py) - (x2-x)*(y1-y) );
		let area2 = Math.abs( (x2-px)*(y3-py) - (x3-x)*(y2-y) );
		let area3 = Math.abs( (x3-px)*(y1-py) - (x1-x)*(y3-y) );
		
		// if the sum of the three areas equals the original,
		// we're inside the triangle!
		if ((area1 + area2 + area3) == areaOrig) 
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	rollover(x, y)
	{
		if(this.isWithinTriangle(x, y))
		{
			this.triangleBrightness = 255;
		}
		else
		{
			this.triangleBrightness = 0;
		}
	}

	drawVelocity()
	{
		//Draw arrow
		push();
		strokeWeight(3);
		translate(this.x, this.y);
		rotate(this.headingRadians);
		line(0,0,0,0-(this.velocity*(800/30))); //800 pixels wide is 30ft
		pop();
	}

	drawTriangle()
	{
		push();
		angleMode(RADIANS);
		translate(this.x, this.y);
		rotate(this.headingRadians);
		strokeWeight(1);
		triangle(0 - (this.triangleWidth/2), 0 + (this.triangleHeight/2), 0 + (this.triangleWidth/2), 0 + (this.triangleHeight/2), 0, 0 - (this.triangleHeight/2));
		fill(255);
		pop();
	}

	draw()
	{
		drawVelocity();
		drawTriangle();
	}
}

class SmoothControlPath
{
	constructor()
	{
		this.poses = [];
		this.selectedPose = null;
	}

	addOrSelect(x, y)
	{
		let gracePixels = 3;
		this.selectedPose = null;
		for(let i = 0; i < this.poses.length; i++)
		{
			if(gracePixels >= dist(x, y, this.poses[i].x, this.poses[i].y))
			{
				this.selectedPose = this.poses[i];
				break;
			}
		}

		if(null == this.selectedPose)
		{
			//No pose clicked, add pose
			let headingRadians = random(0,1) * 2 * PI;
			let pose = new TargetPosition2D(x, y, headingRadians,3);
			this.poses.push(pose);
			print("Added "+ pose.x + ", " + pose.y + ", " + pose.headingRadians);
			this.selectedPose = pose;
		}
	}

	updatePose(x,y)
	{
		if(null == this.selectedPose)
		{
			print("ERROR selected pose NULL! "+ x + ", " +y);
		}
		else
		{
			this.poses.
			this.selectedPose.x = x;
			this.selectedPose.y = y;
		}
	}

	deletePose()
	{
		if(null == this.selectedPose)
		{
			print("No pose to delete. "+ x + ", " +y);
		}
		else
		{
			this.selectedPose;
		}
	}

	draw()
	{
		for(let i = 0; i < this.poses.length; i++)
		{
			this.poses[i].draw();
		}
	}
}
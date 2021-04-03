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
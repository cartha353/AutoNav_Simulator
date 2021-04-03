///<reference path=".\TSDef\p5.global-mode.d.ts" />

let smoothControl;
let img;
let screenWidth = 760;
let screenHeight = 380;
let screenBorderX = 20;
let screenBorderY = 20;
let worldWidth = 30; //Feet
let worldHeight = 15 //Feet

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
	//smoothControl.addOrSelect(mouseX, mouseY);
	smoothControl.select(mouseX, mouseY);
}

function mouseReleased()
{
	smoothControl.unselect(mouseX, mouseY);
}

function mouseDragged()
{
	smoothControl.movePose(mouseX, mouseY);
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
		this.isSelected = false;
		this.selectedState = NOT_SELECTED; //In pose
		this.selectedPoseInd = null;
	}

	select(x, y)
	{
		if(this.selectedState != NOT_SELECTED)
		{
			this.isSelected = true;
		}
		else
		{
			let worldMouse = this.screenSpaceToWorldSpace([x,y]);
			let tempPose = new Pose(worldMouse[0], worldMouse[1], 0, 1);
			this.poses.push(tempPose);
		}
	}

	unselect(x, y)
	{
		this.isSelected = false;
	}

	movePose(x, y)
	{
		let worldMouse = this.screenSpaceToWorldSpace([x,y]);

		if(this.selectedState == TRIANGLE_SELECTED)
		{
			this.poses[this.selectedPoseInd].movePose(worldMouse[0], worldMouse[1], this.poses[this.selectedPoseInd].headingRadians, this.poses[this.selectedPoseInd].velocity);
		}
		else if(this.selectedState == VELOCITY_SELECTED)
		{
			let headingVector = createVector(worldMouse[0] - this.poses[this.selectedPoseInd].position.x, worldMouse[1] - this.poses[this.selectedPoseInd].position.y);
			let newHeading = headingVector.heading();
			let newVelocity = headingVector.mag();
			this.poses[this.selectedPoseInd].movePose(this.poses[this.selectedPoseInd].position.x, this.poses[this.selectedPoseInd].position.y, newHeading, newVelocity);
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

	//Returns [x, y] in screen space (pixels)
	worldSpaceToScreenSpace(worldSpace)
	{
		let screenSpace = [];
		screenSpace[0] = (worldSpace[0]/worldWidth) * screenWidth + screenBorderX;
		screenSpace[1] = screenHeight - ((worldSpace[1]/worldHeight) * screenHeight) + screenBorderY;

		return screenSpace;
	}

	//Returns [x, y] in world space (feet)
	screenSpaceToWorldSpace(screenSpace)
	{
		let worldSpace = [];
		worldSpace[0] = ((screenSpace[0] - screenBorderX)/screenWidth) * worldWidth;
		worldSpace[1] = worldHeight - (((screenSpace[1]-screenBorderY)/screenHeight) * worldHeight);

		return worldSpace;
	}

	drawPose(pose)
	{
		let trianglePoints = new Array(pose.trianglePoints.length);
		let velocityPoints = new Array(pose.velocityPoints.length);

		for(let i = 0; i < pose.trianglePoints.length; i++)
		{
			trianglePoints[i] = this.worldSpaceToScreenSpace(pose.trianglePoints[i]);
		}

		for(let i = 0; i < pose.velocityPoints.length; i++)
		{
			velocityPoints[i] = this.worldSpaceToScreenSpace(pose.velocityPoints[i]);
		}

		push();
		strokeWeight(1);
		fill(0,0,200, pose.triangleBrightness);
		triangle(trianglePoints[0][0], trianglePoints[0][1], 
						 trianglePoints[1][0], trianglePoints[1][1],
						 trianglePoints[2][0], trianglePoints[2][1]);
		fill(255);
		pop();

		push();
		strokeWeight(1);
		fill(0,200,0, pose.velocityBrightness);
		beginShape();
		     vertex(velocityPoints[0][0], velocityPoints[0][1]); 
				 vertex(velocityPoints[1][0], velocityPoints[1][1]);
				 vertex(velocityPoints[2][0], velocityPoints[2][1]);
				 vertex(velocityPoints[3][0], velocityPoints[3][1]);
				 vertex(velocityPoints[0][0], velocityPoints[0][1]);
		endShape();
		pop();
	}

	draw()
	{
		let worldSpaceMouse = this.screenSpaceToWorldSpace([mouseX, mouseY]);
		for(let i = 0; i < this.poses.length; i++)
		{
			if(!this.isSelected)
			{
				//Current selection, do not change state
				this.selectedState = this.poses[i].rollover(worldSpaceMouse[0], worldSpaceMouse[1]);
				if(this.selectedState != NOT_SELECTED)
				{
					this.selectedPoseInd = i;
				}
			}

			//Always draw
			this.drawPose(this.poses[i]);
		}
	}
}
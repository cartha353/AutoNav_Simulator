///<reference path=".\TSDef\p5.global-mode.d.ts" />

let smoothControl;
let img;
let screenWidth = 760;
let screenHeight = 380;
let screenBorderX = 20;
let screenBorderY = 20;
let worldWidth = 30; //Feet
let worldHeight = 15 //Feet
let DEFAULT_BRIGHTNESS = 255;
let ROLLOVER_BRIGHTNESS = 60;

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

function mousePressed()
{
	if(LEFT == mouseButton)
	{
		smoothControl.selectPose(mouseX, mouseY);
	}
	else if(CENTER == mouseButton)
	{
		smoothControl.deletePose(mouseX, mouseY);
	}
}

function mouseReleased()
{
	smoothControl.deselectPose();
}

function mouseDragged()
{
	smoothControl.updatePoses(mouseX, mouseY);
}

class SmoothControlPath
{
	constructor()
	{
		this.poses = [];
		this.isSelected = false;

		let tempPose = new Pose(0, 0, 0, 1);
		this.poses.push(tempPose);

		let tempPose2 = new Pose(2, 2, 0, 1);
		this.poses.push(tempPose2);
	}

	deletePose()
	{
		//Reverse list of poses to prioritize deleting most recent poses first.
		//Only deletes one pose if that pose is selected
		for(let i = this.poses.length-1; i >= 0; i--)
		{
			if(this.poses[i].select())
			{
				//Remove pose from array
				this.poses.splice(i,1);
				//Break so we only delete one pose at a time
				break;
			}
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
		let pathPoints = new Array(pose.pathToNextPose.length);

		let triangleBrightness = DEFAULT_BRIGHTNESS;
		let velocityBrightness = DEFAULT_BRIGHTNESS;

		if(TRIANGLE_SELECTED == pose.rolloverState)
		{
			triangleBrightness = ROLLOVER_BRIGHTNESS;
		}
		else if(VELOCITY_SELECTED == pose.rolloverState)
		{
			velocityBrightness = ROLLOVER_BRIGHTNESS;
		}

		for(let i = 0; i < pose.trianglePoints.length; i++)
		{
			trianglePoints[i] = this.worldSpaceToScreenSpace(pose.trianglePoints[i]);
		}

		for(let i = 0; i < pose.velocityPoints.length; i++)
		{
			velocityPoints[i] = this.worldSpaceToScreenSpace(pose.velocityPoints[i]);
		}

		for(let i = 0; i < pose.pathToNextPose.length; i++)
		{
			pathPoints[i] = this.worldSpaceToScreenSpace(pose.pathToNextPose[i]);
		}

		//Draw path to next pose
		push();
		strokeWeight(5);
		noFill();
		beginShape();
		curveVertex(createVector(pose.position.x, pose.position.y));
		for(let i = 0; i < pathPoints.length; i++)
		{
			curveVertex(pathPoints[i][0], pathPoints[i][1]);
		}
		endShape();
		pop();

		//Draw triangle
		push();
		strokeWeight(1);
		fill(0,0,200, triangleBrightness);
		triangle(trianglePoints[0][0], trianglePoints[0][1], 
						 trianglePoints[1][0], trianglePoints[1][1],
						 trianglePoints[2][0], trianglePoints[2][1]);
		pop();

		//Draw velocity vector
		push();
		strokeWeight(1);
		fill(0,200,0, velocityBrightness);
		beginShape();
		     vertex(velocityPoints[0][0], velocityPoints[0][1]); 
				 vertex(velocityPoints[1][0], velocityPoints[1][1]);
				 vertex(velocityPoints[2][0], velocityPoints[2][1]);
				 vertex(velocityPoints[3][0], velocityPoints[3][1]);
				 vertex(velocityPoints[0][0], velocityPoints[0][1]);
		endShape();
		pop();
	}

	updatePoses(x, y)
	{
		let worldSpaceMouse = this.screenSpaceToWorldSpace([mouseX, mouseY]);
		this.poses.forEach(function(pose)
		{
			pose.updatePose(worldSpaceMouse[0], worldSpaceMouse[1]);
		});
	}

	selectPose(x, y)
	{
		let poseNotSelected = true;

		//Alert each pose about possible selection
		this.poses.forEach(function(pose)
		{
			//If the rollover state is not NOT_SELECTED, the pose will mark itself as selected
			if(pose.select())
			{
				//A pose has been selected
				poseNotSelected = false;
			}
		});

		if(poseNotSelected)
		{
			//No pose selected, add a new pose to the end of the list
			let worldMouse = this.screenSpaceToWorldSpace([x,y]);
			let tempPose = new Pose(worldMouse[0], worldMouse[1], 0, 1);
			this.poses.push(tempPose);
		}
	}

	deselectPose()
	{
		this.poses.forEach(function(pose)
		{
			pose.deselect();
		});
	}

	draw()
	{
		let worldSpaceMouse = this.screenSpaceToWorldSpace([mouseX, mouseY]);
		//Always draw
		for(let i = 0; i < this.poses.length; i++)
		{
			let pose = this.poses[i]; 
			pose.rollover(worldSpaceMouse[0], worldSpaceMouse[1]);
			pose.updatePose(worldSpaceMouse[0], worldSpaceMouse[1]);
			pose.clearPathList();
			
			//If there is a next pose, calculate the path between the two to draw
			if((i+1) < this.poses.length)
			{
				let targetPosition = [this.poses[i+1].position.x, this.poses[i+1].position.y, this.poses[i+1].headingRadians];
				pose.populatePathList(targetPosition);
			}

			smoothControl.drawPose(pose);
		}
	}
}

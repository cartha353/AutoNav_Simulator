# AutoNav_Simulator
For now this is only supported in Firefox and VSCode.

# How to Use
## VSCode
1. Download and install VSCode [here](https://code.visualstudio.com/download)
2. Click on extension, and install the p5.vscode extension by clicking [this link here](https://marketplace.visualstudio.com/items?itemName=samplavigne.p5-vscode)
3. Open the AutoNav_Simulator project folder in VScode
4. Click the "Go Live" button in the very bottom right of the screen

## Firefox
1. Allow local javascript to be run in the Firefox settings. 
  For Firefox:
  1. Open a new browser and type "about:config" in the address bar. Click accept the risk and continue
  2. Enter security.fileuri.strict_origin_policy in the search bar and change that to false
  - This will allow local javascript files to run on your PC.  **__THIS DANGEROUS AND SHOULD BE REVERSED WHEN DONE!__**
2. After downloading the AutoNav_Simulator repo, double click on index.html

#Controls
Left click on a the field to add a new pose.
Click and drag on the pose to change its position on the field
Click and drag on the green "velocity" bar to change the pose heading and velocity
Middle mouse click on a pose to delete it

Click the "Slalom", "Bounce", and "Barrel" buttons to change the field image.
Click the Write Data button to export the data into a csv file (usable in MATLAB), and a text file which will contain the java code to add the data to a SPIKE293 autonav path.

# ToDo
- Add angular velocity limits
- Verify data is correct
- Add how to use instructions in sketch
- Fix the terrible looking GUI (I'm no artist)

## Disclaimer
This code is delivered as is and the author is not responsible for any damages incurred from use of this code our the setup of this code. You're on your own!

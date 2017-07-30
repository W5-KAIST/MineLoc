/*
 * Modified draw.js script of the WorldEdit MC plugin for LoC structure genreation
 * By sillo, captain of Team W5.KAIST @ Microrobot Research
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

importPackage(Packages.java.io);
importPackage(Packages.java.awt);
importPackage(Packages.javax.imageio);
importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.blocks);

function makeColor(r, g, b)
{
    return new Color(r / 255, g / 255, b / 255);
}

var clothColors = [
    makeColor(254, 254, 254), // White - fixed so white gets picked over pink for white pixels
    //makeColor(255, 100, 0), // Orange
    //makeColor(200, 0, 200), // Magenta
    //makeColor(87, 132, 223), // Light blue
    makeColor(255, 255, 0), // Yellow
    //makeColor(0, 255, 0), // Green
    //makeColor(255, 180, 200), // Pink
    //makeColor(72, 72, 72), // Gray
    //makeColor(173, 173, 173), // Light grey
    //makeColor(0, 100, 160), // Cyan
    //makeColor(120, 0, 200), // Purple
    makeColor(0, 0, 175), // Blue
    //makeColor(100, 60, 0), // Brown
    //makeColor(48, 80, 0), // Cactus green
    makeColor(255, 0, 0), // Red
    makeColor(0, 0, 0), // Black
]

function colorDistance(c1, c2) 
{
    var rmean = (c1.getRed() + c2.getRed()) / 2;
    var r = c1.getRed() - c2.getRed();
    var g = c1.getGreen() - c2.getGreen();
    var b = c1.getBlue() - c2.getBlue();
    var weightR = 2 + rmean/256;
    var weightG = 4.0;
    var weightB = 2 + (255-rmean)/256

    return Math.sqrt(weightR*r*r + weightG*g*g + weightB*b*b);
}

function findClosestWoolColor(col, clothColors)
{
	var closestId = 0;
	var closestDistance = colorDistance(col, clothColors[0]);
	
	for(var i = 1; i < clothColors.length; i++)
	{
		var dist = colorDistance(col, clothColors[i]);
		
		if(dist < closestDistance) 
		{
			closestId = i;
			closestDistance = dist;
		}
	}
	
	return closestId;
}


context.checkArgs(1, 3, "<image> <orientation> <palette>");

var baseheight = 3;
var f = context.getSafeFile("drawings", argv[1]);
var sess = context.remember();
var colors = clothColors;


if (!f.exists())
{
    player.printError("Specified file doesn't exist.");
} else {
	var img = ImageIO.read(f);
	var width = img.getWidth();
	var height = img.getHeight();

	var origin = player.getBlockIn();

	for (var x = 0; x < width; x++)
	{
        	for (var y = 0; y < height; y++)
		{
            		var c = new Color(img.getRGB(x, y));
            		var data = findClosestWoolColor(c,colors);
				
			if(data == 0) // white
			{
				for(var h=0; h < baseheight+1; h++)
				{
					sess.setBlock(origin.add(x, h, y), new BaseBlock(35, 0));
				}

				for(var z=1; z< 2; z++)
				{
					sess.setBlock(origin.add(x, z + baseheight, y), new BaseBlock(35, data));
				}
			}
			else if(data == 1) // yellow
			{
				for(var h=0; h < baseheight; h++)
				{
					sess.setBlock(origin.add(x, h, y), new BaseBlock(35, 0));
				}

				for(var z=1; z< 7; z++)
				{
					sess.setBlock(origin.add(x, z + baseheight , y), new BaseBlock(35, data + 3));
				}
			}
			else if(data == 2)// blue
			{
				for(var h=0; h < baseheight; h++)
				{
					sess.setBlock(origin.add(x, h, y), new BaseBlock(35, 0));
				}

				for(var z=1; z< 7; z++)
				{
					sess.setBlock(origin.add(x, z + baseheight, y), new BaseBlock(35, data + 9));
				}
			}
			else if(data == 3) //red
			{
				for(var h=0; h < baseheight; h++)
				{
					sess.setBlock(origin.add(x, h, y), new BaseBlock(35, 0));
				}

				for(var z=1; z< 17; z++)
				{
					sess.setBlock(origin.add(x, z + baseheight, y), new BaseBlock(35, data + 11));
				}
			}
			else if(data == 4) //black
			{
				for(var h=0; h < baseheight; h++)
				{
					sess.setBlock(origin.add(x, h, y), new BaseBlock(35, 0));
				}

				for(var z=1; z< 7; z++)
				{
					sess.setBlock(origin.add(x, z + baseheight, y), new BaseBlock(35, data + 11));
				}
			}
			else{
                		//sess.setBlock(origin.add(x, 0, y), new BaseBlock(35, data));
			}
		}
	}
}
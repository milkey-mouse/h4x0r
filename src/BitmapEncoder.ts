module Haxor
{
	export class BitmapEncoder //adapted from https://github.com/shaozilee/bmp-js
	{
		encodeBitmap(arr: Uint8Array, width: number, height: number)
		{
			var buffer: Uint8Array = arr;
		    var extraBytes: number = width%4;
			var rgbSize: number = height*(3*width+extraBytes);
			var headerInfoSize: number = 40;
			
			var data: Array = [];
			/**********header**********/
			var flag: string = "BM";
			var reserved: number = 0;
			var offset: number = 54;
			var fileSize: number = rgbSize+offset;
			var planes: number = 1;
			var bitPP: number = 24;
			var compress: number = 0;
			var hr: number = 0;
			var vr: number = 0;
			var colors: number = 0;
			var importantColors: number = 0;
			
			var tempBuffer = new Buffer(offset+rgbSize);
			var pos: number = 0;
			
			tempBuffer.write(flag,pos,2);pos+=2;
			tempBuffer.writeUInt32LE(fileSize,pos);pos+=4;
			tempBuffer.writeUInt32LE(reserved,pos);pos+=4;
			tempBuffer.writeUInt32LE(offset,pos);pos+=4;
		
			tempBuffer.writeUInt32LE(headerInfoSize,pos);pos+=4;
			tempBuffer.writeUInt32LE(width,pos);pos+=4;
			tempBuffer.writeUInt32LE(height,pos);pos+=4;
			tempBuffer.writeUInt16LE(planes,pos);pos+=2;
			tempBuffer.writeUInt16LE(bitPP,pos);pos+=2;
			tempBuffer.writeUInt32LE(compress,pos);pos+=4;
			tempBuffer.writeUInt32LE(rgbSize,pos);pos+=4;
			tempBuffer.writeUInt32LE(hr,pos);pos+=4;
			tempBuffer.writeUInt32LE(vr,pos);pos+=4;
			tempBuffer.writeUInt32LE(colors,pos);pos+=4;
			tempBuffer.writeUInt32LE(importantColors,pos);pos+=4;
		
			var i=0;
			var rowBytes = 3*width+extraBytes;
		
			for (var y = height - 1; y >= 0; y--){
				for (var x = 0; x < width; x++){
					var p = pos+y*rowBytes+x*3;
					tempBuffer[p+2]= buffer[i++];//r
					tempBuffer[p+1] = buffer[i++];//g
					tempBuffer[p]  = buffer[i++];//b
					i++;
				}
				if(extraBytes>0){
					var fillOffset = pos+y*rowBytes+width*3;
					tempBuffer.fill(0,fillOffset,fillOffset+extraBytes);	
				}
			}
		
			return tempBuffer;
		}
	}
}
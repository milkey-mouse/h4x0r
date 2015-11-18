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
			
			//var data: Array = [];
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
			
			var tempBuffer = window.bops.create(offset+rgbSize);
			var pos: number = 0;
			
			window.bops.copy(window.bops.from(flag),tempBuffer,0,0,2);pos+=2;
			window.bops.writeUInt32LE(tempBuffer,fileSize,pos);pos+=4;
			window.bops.writeUInt32LE(tempBuffer,reserved,pos);pos+=4;
			window.bops.writeUInt32LE(tempBuffer,offset,pos);pos+=4;
		
			window.bops.writeUInt32LE(tempBuffer,headerInfoSize,pos);pos+=4;
			window.bops.writeUInt32LE(tempBuffer,width,pos);pos+=4;
			window.bops.writeUInt32LE(tempBuffer,height,pos);pos+=4;
			window.bops.writeUInt16LE(tempBuffer,planes,pos);pos+=2;
			window.bops.writeUInt16LE(tempBuffer,bitPP,pos);pos+=2;
			window.bops.writeUInt32LE(tempBuffer,compress,pos);pos+=4;
			window.bops.writeUInt32LE(tempBuffer,rgbSize,pos);pos+=4;
			window.bops.writeUInt32LE(tempBuffer,hr,pos);pos+=4;
			window.bops.writeUInt32LE(tempBuffer,vr,pos);pos+=4;
			window.bops.writeUInt32LE(tempBuffer,colors,pos);pos+=4;
			window.bops.writeUInt32LE(tempBuffer,importantColors,pos);pos+=4;
		
			var i=0;
			var rowBytes = 3*width+extraBytes;
		
			for (var y = height - 1; y >= 0; y--){
				for (var x = 0; x < width; x++){
					var p = pos+y*rowBytes+x*3;
					tempBuffer[p]   = arr[i++];//r
					tempBuffer[p+1] = arr[i++];//g
					tempBuffer[p+2] = arr[i++];//b
					i++;
				}
				if(extraBytes>0){
					var fillOffset = pos+y*rowBytes+width*3;
					tempBuffer.fill(0,fillOffset,fillOffset+extraBytes);	
				}
			}
		
			return "data:image/x-ms-bmp;base64," + window.bops.to(tempBuffer, "base64");
		}
	}
}
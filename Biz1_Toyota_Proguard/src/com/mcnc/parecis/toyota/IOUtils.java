package com.mcnc.parecis.toyota;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import android.content.Context;
import android.os.Environment;
import android.util.Log;

public class IOUtils {
	//final static String FILE_NAME = "hello.txt";

	public static void writeToFile(String fileName, String body) {
		FileOutputStream fos = null;
		try {
			 Log.d("test", "=======================================>"+"1"+fileName);	  
			final File dir = new File(Environment.getExternalStorageDirectory()
					.getAbsolutePath() + "/TFSKR/");
			if (!dir.exists()) {
				Log.d("test", "=======================================>"+"no dir!");	  
				dir.mkdirs();
			}
			Log.d("test", "=======================================>"+"path : "+dir.toString());
			final File myFile = new File(dir, fileName + ".txt");
			if (!myFile.exists()) {
				Log.d("test", "=======================================>"+"no file! : "+fileName);	  
				myFile.createNewFile();
			}
			Log.d("test", "=======================================>"+"4");	  
			fos = new FileOutputStream(myFile);
			fos.write(body.getBytes());
			fos.close();
			Log.d("test", "=======================================>"+"5 : "+body);	
			
			
			Log.d("test", "=======================================>"+"6");	
			
		} catch (IOException e) {
			Log.d("test", "=======================================>"+"7");	  
			e.printStackTrace();
		}

	}
}

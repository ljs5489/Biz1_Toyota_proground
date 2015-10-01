/*
package com.mcnc.parecis.toyota;

import java.io.File;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;

public class MyJavaScriptInterface{

	private WebView webView;
	private Handler tempHandler;
	private Context context;		
	private String layoutService;
	private MainActivity test;
	
	public MyJavaScriptInterface(WebView webView, Handler tempHandler, Context temp, String layoutService) {
		this.webView = webView;
		this.tempHandler=tempHandler;
		this.context= temp;
		this.layoutService=layoutService;
		this.test=test;
	}	


	@JavascriptInterface
	public void showToast(String text){
		Toast.makeText(this.context,text,Toast.LENGTH_SHORT).show();
		
		
	}
	@JavascriptInterface
	public void test(){
		Intent intent = new Intent(this.context,PrintDialogActivity.class);	
	}
	
	@JavascriptInterface
	public void printMyDoc(String text1, String text2){
		try{
			Message msg=new Message();
			Bundle bundle=msg.getData();
			bundle.putString("test","samplr.pdf");
			msg.setData(bundle);
			
			tempHandler.handleMessage(msg);
			//IOUtils.writeToFile(text1, text2);
			showToast("성공!");
		}
		catch(Exception e){
			showToast("creating PDF failed...!");
		}
		
		
	}
}
*/

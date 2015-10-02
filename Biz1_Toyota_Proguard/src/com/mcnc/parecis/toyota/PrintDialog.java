package com.mcnc.parecis.toyota;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ContentResolver;
import android.content.Intent;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class PrintDialog extends Activity {
	private static final String PRINT_DIALOG_URL = "https://www.google.com/cloudprint/dialog.html";
	private static final String JS_INTERFACE = "AndroidPrintDialog";
	private static final String CONTENT_TRANSFER_ENCODING = "base64";

	private static final String ZXING_URL = "http://zxing.appspot.com";
	private static final int ZXING_SCAN_REQUEST = 65743;

	/**
	 * Post message that is sent by Print Dialog web page when the printing
	 * dialog needs to be closed.
	 * 
	 * @return
	 */

	private static final String CLOSE_POST_MESSAGE_NAME = "cp-dialog-on-close";

	/**
	 * Web view element to show the printing dialog in.
	 */
	private WebView dialogWebView;

	/**
	 * Intent that started the action.
	 */
	Intent cloudPrintIntent;

	@Override
	public void onCreate(Bundle icicle) {
		super.onCreate(icicle);

		setContentView(R.layout.activity_print_dialog);
		dialogWebView = (WebView) findViewById(R.id.webview);
		cloudPrintIntent = this.getIntent();

		WebSettings settings = dialogWebView.getSettings();
		settings.setJavaScriptEnabled(true);

		dialogWebView.setWebViewClient(new PrintDialogWebClient());
		dialogWebView.addJavascriptInterface(new PrintDialogJavaScriptInterface(), JS_INTERFACE);
		dialogWebView.loadUrl(PRINT_DIALOG_URL);
	}

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		if (requestCode == ZXING_SCAN_REQUEST && resultCode == RESULT_OK) {
			dialogWebView.loadUrl(intent.getStringExtra("SCAN_RESULT"));
		}
	}

	public void logCat(String tag, String state) {
		Log.d(tag, "=======================================>" + state);
	}

	final class PrintDialogJavaScriptInterface {
		@JavascriptInterface
		public String getType() {
			logCat("getType", cloudPrintIntent.getType());
			return cloudPrintIntent.getType();
		}

		@JavascriptInterface
		public String getTitle() {
			logCat("getTitle", cloudPrintIntent.getExtras().getString("title"));
			return cloudPrintIntent.getExtras().getString("title");
		}

		
		public InputStream StringToIS(String text) throws Exception{
			String str = text;
			InputStream is = new ByteArrayInputStream(str.getBytes());
			return is;
		}
	
		@JavascriptInterface
		public String getContent() throws Exception {
			logCat("getContent", "start!");	
			
			try {
				ContentResolver contentResolver = getContentResolver();
				logCat("getContent", "start2");
				
				//InputStream is = contentResolver.openInputStream(cloudPrintIntent.getData());				
				InputStream is = StringToIS(cloudPrintIntent.getExtras().getString("content"));			
				
				ByteArrayOutputStream baos = new ByteArrayOutputStream();

				byte[] buffer = new byte[4096];
				int n = is.read(buffer);
				while (n >= 0) {
					baos.write(buffer, 0, n);
					n = is.read(buffer);
					logCat("getContent", "start3");
				}
				is.close();
				baos.flush();

				return Base64.encodeToString(baos.toByteArray(), Base64.DEFAULT);
				
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			logCat("getContent", "start4");
			return "";
			
		}

		@JavascriptInterface
		public String getEncoding() {
			logCat("getEncoding", CONTENT_TRANSFER_ENCODING);
			return CONTENT_TRANSFER_ENCODING;
		}

		@JavascriptInterface
		public void onPostMessage(String message) {

			if (message.startsWith(CLOSE_POST_MESSAGE_NAME)) {
				logCat("onPostMessage", "hello~");
				finish();
			}
		}
	}

	private final class PrintDialogWebClient extends WebViewClient {
		@Override
		public boolean shouldOverrideUrlLoading(WebView view, String url) {
			if (url.startsWith(ZXING_URL)) {
				Intent intentScan = new Intent("com.google.zxing.client.android.SCAN");
				intentScan.putExtra("SCAN_MODE", "QR_CODE_MODE");
				try {
					startActivityForResult(intentScan, ZXING_SCAN_REQUEST);
				} catch (ActivityNotFoundException error) {
					view.loadUrl(url);
				}
			} else {
				view.loadUrl(url);
			}
			return false;
		}

		@Override
		public void onPageFinished(WebView view, String url) {
			if (PRINT_DIALOG_URL.equals(url)) {
				// Submit print document.
				view.loadUrl("javascript:printDialog.setPrintDocument(printDialog.createPrintDocument(" + "window."
						+ JS_INTERFACE + ".getType(),window." + JS_INTERFACE + ".getTitle()," + "window." + JS_INTERFACE
						+ ".getContent(),window." + JS_INTERFACE + ".getEncoding()))");

				// Add post messages listener.
				view.loadUrl("javascript:window.addEventListener('message'," + "function(evt){window." + JS_INTERFACE
						+ ".onPostMessage(evt.data)}, false)");
			}
		}
	}
}
package com.mcnc.parecis.toyota;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.json.JSONException;
import org.json.JSONObject;


import com.mcnc.hsmart.core.log.Logger;
import com.mcnc.hsmart.view.MainActivity;
import com.mcnc.hsmart.wrapper.ImageWrappter;
import com.mcnc.parecis.bizmob.def.Def;
import com.mcnc.parecis.bizmob.view.ImpLoginActivity;
import com.mcnc.parecis.bizmob.view.ImpMainActivity;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.res.AssetManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.Display;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.CursorAdapter;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.SimpleCursorAdapter;
import android.widget.Toast;

public class PrintList extends Activity {

	ListView listView;
	String html="<html><head><h1>it is test</h1></head><body>hello world~~~~~~~~!</body></html>";

	@Override
	protected void onResume() {
		super.onResume();
	}

	@Override
	public void onCreate(Bundle icicle) {
		super.onCreate(icicle);
		setContentView(R.layout.activity_print_list);
		listView = (ListView) findViewById(R.id.list);
		String[] values = new String[] { "Android List View", "Adapter implementation", "Simple List View In Android",
				"Create List View Android", "Android Example", "List View Source Code", "List View Array Adapter",
				"Android Example List View", "List View Source Code1", "List View Array Adapter2",
				"Android Example List View3" };

		Toast.makeText(PrintList.this, "You don't say!", Toast.LENGTH_SHORT).show();

		ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1,
				android.R.id.text1, values);
		listView.setAdapter(adapter);
		listView.setOnItemClickListener(new OnItemClickListener() {
			@Override
			public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
				int itemPosition = position;// ListView Clicked item index
				String itemValue = (String) listView.getItemAtPosition(position);				
				Toast.makeText(getApplicationContext(), "Position :" + itemPosition + "  ListItem : " + itemValue,Toast.LENGTH_SHORT).show();
				
				Intent PrintDialog = new Intent(getBaseContext(), PrintDialog.class);				

				PrintDialog.putExtra("title", itemValue);
				PrintDialog.putExtra("content", html);
				PrintDialog.setType("text/html"); //PrintDialog.setDataAndType(null,"text/html"); 대신 넣어줌
				startActivity(PrintDialog);		

			}

		});
	}
	
	
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {

		if (!Def.IS_RELEASE) {
			if (keyCode == KeyEvent.KEYCODE_MENU) {

				Toast.makeText(PrintList.this, "I have cold feet.", Toast.LENGTH_SHORT).show();
				// Intent printList = new Intent(ImpLoginActivity.this,
				// PrintList.class);
				// startActivity(printList);
			}
		}

		return super.onKeyDown(keyCode, event);

	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		Toast.makeText(PrintList.this, "I Lost my head!", Toast.LENGTH_SHORT).show();
		int id = item.getItemId();
		if (id == R.id.action_settings) {
			return true;
		}
		return super.onOptionsItemSelected(item);
	}
}

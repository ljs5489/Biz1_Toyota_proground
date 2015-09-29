package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DB {
	private static String JDBC_DRIVER_NAME = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
	private static String DB_URL = "jdbc:sqlserver://127.0.0.1;databaseName=JSLEE";
	//private static String USER_ID = "sa";
	//private static String USER_PASSWORD = "test123";
	private static String USER_ID = "jslee";
	private static String USER_PASSWORD = "1q2w3e1#";

    public static Connection getConnection() throws ClassNotFoundException, SQLException {
        Class.forName(JDBC_DRIVER_NAME);
        Connection connection = DriverManager.getConnection(DB_URL, USER_ID, USER_PASSWORD);
        return connection;
    }
    
}

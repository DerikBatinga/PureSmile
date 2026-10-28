package com.pure.smile.connection;
import io.github.cdimascio.dotenv.Dotenv;

import java.sql.*;

public class connection {
    Dotenv dotenv = Dotenv.load();
    final String driver = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
    final String url = "jdbc:sqlserver://localhost:1433;databaseName=puresmile;encrypt=true;trustServerCertificate=true";
    final String user = dotenv.get("DB_MYSQLROOTUSERNAME");
    final String password = dotenv.get("DB_MYSQLROOTPASSWORD");
    private Connection connectionDB;
    public Statement statement;
    public ResultSet resultSet;

    public boolean connection () throws SQLException {
        try {
            Class.forName(driver);
            connectionDB = DriverManager.getConnection(url, user, password);
            System.out.println("DB connection started");
            return true;
        }
        catch(ClassNotFoundException e){
            System.out.println("Invalid Drive");
            e.printStackTrace();
            return false;
        }
        catch (SQLException e) {
            System.out.println("Falha ao conectar" + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public void desconnection(){
        try{
            connectionDB.close();
            System.out.println("DB Connection Closed.");
        }catch(SQLException e){
            System.out.println("DB Connection not found");
            e.printStackTrace();
        }
    }
    public void SQLexe(String sqlCommand){
        try{
            statement = connectionDB.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
            resultSet = statement.executeQuery(sqlCommand);
        }catch(SQLException e){
            System.out.println("SQL command invalid!");
            e.printStackTrace();
        }
    }
}
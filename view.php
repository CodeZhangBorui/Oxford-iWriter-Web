<?php

function contruct() {
    error_reporting(-1);
    include "./_pdo.php";
    $db_file = "db/sqlite-database.db";
    PDO_Connect("sqlite:$db_file");
}

function test() {
    contruct();

    $queries = 'CREATE TABLE projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(50), data_id INTEGER, date_time DATETIME, data TEXT, dtime varchar(50))';

    print("<h2>Create table and insert exampe data</h2>");
    print("<pre style='background:#ddd'>");
    $queries = explode(";", $queries);

    foreach ($queries as $query) {
        $query = trim($query);
        if (!$query)
            continue;
        $stmt = @PDO_Execute($query);
        if (!$stmt || ($stmt && $stmt->errorCode() != 0)) {
            $error = PDO_ErrorInfo();
            print_r($error[2]);
            break;
        }
        print($query . "\n");
    }

    print("</pre>");
    print("<h2>Fetch data</h2>");
    print("PDO_FetchAll('SELECT * FROM projects')");
    print("<pre style='background:#ddd'>");
    $data = PDO_FetchAll("SELECT * FROM projects");
    print_r($data);
    print("</pre>");

    $queries = <<< HTML
DROP TABLE projects;
HTML;

    /* echo date('D M d Y H:i:s');

      $stmt = @PDO_Execute($queries);
      if (!$stmt || ($stmt && $stmt->errorCode() != 0)) {
      $error = PDO_ErrorInfo();
      print_r($error);
      }
      date_default_timezone_set('UTC'); */
}

test();
?>
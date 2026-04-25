import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;
import java.io.*;
import java.util.*;
import java.net.URI;
import java.net.http.*;

public class main extends Application {
    private Map<String, String> userDatabase = new HashMap<>(); 
    private Map<String, Integer> userPoints = new HashMap<>();   
    private final String FILE_NAME = "users.txt";
    private Stage window;
    private String currentUser = "";

    @Override
    public void start(Stage primaryStage) {
        window = primaryStage;
        loadUserData();

        VBox loginLayout = new VBox(15);
        loginLayout.setAlignment(Pos.CENTER);
        Label title = new Label("Eco-Route Tracker");
        title.setStyle("-fx-font-size: 24px; -fx-font-weight: bold; -fx-text-fill: #2e7d32;");
        
        TextField userField = new TextField(); userField.setPromptText("Username"); userField.setMaxWidth(200);
        PasswordField passField = new PasswordField(); passField.setPromptText("Password"); passField.setMaxWidth(200);
        Button loginBtn = new Button("Login");
        
        loginBtn.setOnAction(e -> {
            if(userDatabase.containsKey(userField.getText())) {
                currentUser = userField.getText();
                switchToRouting();
            }
        });
        
        loginLayout.getChildren().addAll(title, userField, passField, loginBtn);
        window.setScene(new Scene(loginLayout, 400, 500));
        window.setTitle("Login");
        window.show();
    }

    private void switchToRouting() {
        BorderPane root = new BorderPane();
        HBox topBar = new HBox(15);
        topBar.setStyle("-fx-background-color: #2e7d32; -fx-padding: 12;");
        Label ptsLabel = new Label("🌿 Eco Points: " + userPoints.getOrDefault(currentUser, 0));
        ptsLabel.setStyle("-fx-text-fill: white; -fx-font-weight: bold;");
        topBar.getChildren().add(ptsLabel);

        VBox inputArea = new VBox(10);
        inputArea.setPadding(new Insets(20));
        TextField origin = new TextField(); origin.setPromptText("Origin (e.g. London)");
        TextField dest = new TextField(); dest.setPromptText("Destination (e.g. Paris)");
        Button searchBtn = new Button("Search Real Routes");
        inputArea.getChildren().addAll(new Label("Start:"), origin, new Label("End:"), dest, searchBtn);

        VBox resultsArea = new VBox(10);
        resultsArea.setPadding(new Insets(20));

        searchBtn.setOnAction(e -> {
            resultsArea.getChildren().clear();
            resultsArea.getChildren().add(new Label("Searching API..."));
            
            new Thread(() -> {
                int drive = fetchTime(origin.getText(), dest.getText(), "car");
                int bike = fetchTime(origin.getText(), dest.getText(), "bike");
                int walk = fetchTime(origin.getText(), dest.getText(), "foot");

                javafx.application.Platform.runLater(() -> {
                    resultsArea.getChildren().clear();
                    if (drive == 0) {
                        resultsArea.getChildren().add(new Label("Error: Could not find locations."));
                    } else {
                        addRouteCard(resultsArea, "Walking", walk, 2.0, "🚶");
                        addRouteCard(resultsArea, "Biking", bike, 1.5, "🚲");
                        addRouteCard(resultsArea, "Driving", drive, 1.0, "🚗");
                    }
                });
            }).start();
        });

        root.setTop(topBar);
        root.setLeft(inputArea);
        root.setCenter(resultsArea);
        window.setScene(new Scene(root, 1000, 700));
    }

    private int fetchTime(String start, String end, String mode) {
        try {
            String startCoords = geocode(start);
            String endCoords = geocode(end);
            if (startCoords == null || endCoords == null) return 0;

            String url = "http://router.project-osrm.org/route/v1/" + mode + "/" + startCoords + ";" + endCoords + "?overview=false";
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // Simple Manual Parse for "duration":
            String body = response.body();
            int index = body.indexOf("\"duration\":") + 11;
            int endIdx = body.indexOf(",", index);
            double seconds = Double.parseDouble(body.substring(index, endIdx));
            return (int) (seconds / 60);
        } catch (Exception e) { return 0; }
    }

    private String geocode(String city) throws Exception {
        String url = "https://nominatim.openstreetmap.org/search?q=" + city.replace(" ", "+") + "&format=json&limit=1";
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).header("User-Agent", "EcoApp").build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        
        String body = response.body();
        if (body.length() < 10) return null;
        
        // Simple Manual Parse for lon/lat
        int lonIdx = body.indexOf("\"lon\":\"") + 7;
        String lon = body.substring(lonIdx, body.indexOf("\"", lonIdx));
        int latIdx = body.indexOf("\"lat\":\"") + 7;
        String lat = body.substring(latIdx, body.indexOf("\"", latIdx));
        
        return lon + "," + lat; // OSRM expects lon,lat
    }

    private void addRouteCard(VBox container, String mode, int mins, double mult, String icon) {
        int earned = (int) (mins * mult);
        HBox card = new HBox(20);
        card.setStyle("-fx-background-color: white; -fx-padding: 15; -fx-border-color: #ccc; -fx-border-radius: 5;");
        card.setAlignment(Pos.CENTER_LEFT);
        
        Button selectBtn = new Button("Claim " + earned + " pts");
        selectBtn.setStyle("-fx-background-color: #2e7d32; -fx-text-fill: white;");
        selectBtn.setOnAction(e -> {
            userPoints.put(currentUser, userPoints.getOrDefault(currentUser, 0) + earned);
            updateUserFile();
            switchToRouting();
        });

        card.getChildren().addAll(new Label(icon), new Label(mode + " (" + mins + " mins)"), selectBtn);
        container.getChildren().add(card);
    }

    private void loadUserData() {
        try {
            File f = new File(FILE_NAME);
            if (!f.exists()) f.createNewFile();
            Scanner sc = new Scanner(f);
            while (sc.hasNextLine()) {
                String[] p = sc.nextLine().split(",");
                if (p.length >= 2) {
                    userDatabase.put(p[0], p[1]);
                    userPoints.put(p[0], p.length > 2 ? Integer.parseInt(p[2]) : 0);
                }
            }
            sc.close();
        } catch (Exception e) { }
    }

    private void updateUserFile() {
        try (PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter(FILE_NAME, false)))) {
            for (String user : userDatabase.keySet()) {
                out.println(user + "," + userDatabase.get(user) + "," + userPoints.get(user));
            }
        } catch (IOException e) { }
    }

    public static void main(String[] args) { launch(args); }
}
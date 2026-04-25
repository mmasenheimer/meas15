import javafx.application.Application;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.chart.LineChart;
import javafx.scene.chart.NumberAxis;
import javafx.scene.chart.XYChart;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;

public class Dashboard extends Application {

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("CaskGuard Pro - Nuclear Stewardship Dashboard v2026.1");

        // 1. TOP NAV - Summary Stats
        HBox topStats = new HBox(20);
        topStats.setPadding(new Insets(15));
        topStats.setStyle("-fx-background-color: #2c3e50;");
        
        topStats.getChildren().addAll(
            createStatLabel("Total Casks: 1,240", "white"),
            createStatLabel("Active Cooling: 98%", "#2ecc71"),
            createStatLabel("AI Alerts: 2 High Priority", "#e74c3c")
        );

        // 2. LEFT SIDE - Cask Inventory Table
        TableView<CaskData> table = new TableView<>();
        TableColumn<CaskData, String> idCol = new TableColumn<>("Cask ID");
        idCol.setCellValueFactory(data -> data.getValue().idProperty());
        
        TableColumn<CaskData, String> statusCol = new TableColumn<>("Integrity Score");
        statusCol.setCellValueFactory(data -> data.getValue().scoreProperty());

        table.getColumns().addAll(idCol, statusCol);
        table.setItems(getMockCaskData());
        table.setPrefWidth(300);

        // 3. RIGHT SIDE - AI Analytics Chart
        final NumberAxis xAxis = new NumberAxis();
        final NumberAxis yAxis = new NumberAxis();
        xAxis.setLabel("Time (Hours)");
        yAxis.setLabel("Thermal Flux (°C)");
        
        LineChart<Number, Number> lineChart = new LineChart<>(xAxis, yAxis);
        lineChart.setTitle("AI Predictive Thermal Modeling");
        
        XYChart.Series<Number, Number> series = new XYChart.Series<>();
        series.setName("Vault Section A-12");
        series.getData().add(new XYChart.Data<>(1, 23));
        series.getData().add(new XYChart.Data<>(2, 28));
        series.getData().add(new XYChart.Data<>(3, 26));
        series.getData().add(new XYChart.Data<>(4, 30));
        
        lineChart.getData().add(series);

        // 4. LAYOUT ASSEMBLY
        VBox rightSide = new VBox(10, lineChart, new Label("Log Feed: [System] AI analyzing micro-fracture acoustics..."));
        rightSide.setPadding(new Insets(10));

        BorderPane mainLayout = new BorderPane();
        mainLayout.setTop(topStats);
        mainLayout.setLeft(table);
        mainLayout.setCenter(rightSide);

        Scene scene = new Scene(mainLayout, 900, 600);
        scene.getStylesheets().add("https://fonts.googleapis.com/css2?family=Roboto+Mono"); // Tech aesthetic
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private Label createStatLabel(String text, String color) {
        Label label = new Label(text);
        label.setStyle("-fx-text-fill: " + color + "; -fx-font-weight: bold; -fx-font-size: 14px;");
        return label;
    }

    private ObservableList<CaskData> getMockCaskData() {
        return FXCollections.observableArrayList(
            new CaskData("CSK-001", "99.4% (Nominal)"),
            new CaskData("CSK-002", "88.2% (Monitor)"),
            new CaskData("CSK-003", "94.1% (Nominal)"),
            new CaskData("CSK-004", "72.0% (Action Required)")
        );
    }

    // Data Model Class
    public static class CaskData {
        private final javafx.beans.property.SimpleStringProperty id;
        private final javafx.beans.property.SimpleStringProperty score;

        public CaskData(String id, String score) {
            this.id = new javafx.beans.property.SimpleStringProperty(id);
            this.score = new javafx.beans.property.SimpleStringProperty(score);
        }
        public javafx.beans.property.StringProperty idProperty() { return id; }
        public javafx.beans.property.StringProperty scoreProperty() { return score; }
    }

    public static void main(String[] args) {
        launch(args);
    }
}

use axum::{Router, Json};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct CountRequest { text: String }
#[derive(Serialize)]
struct CountResponse { words: u32, characters: u32, sentences: u32, paragraphs: u32, reading_time: String }

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let app = Router::new()
        .route("/", axum::routing::get(root))
        .route("/health", axum::routing::get(health))
        .route("/count", axum::routing::post(count_text))
        .layer(tower_http::cors::CorsLayer::permissive());
    let port = std::env::var("PORT").unwrap_or_else(|_| "3001".into());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await.unwrap();
    tracing::info!("wordcounter backend running on :{}", port);
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> Json<serde_json::Value> { Json(serde_json::json!({"service": "wordcounter", "status": "running"})) }
async fn health() -> Json<serde_json::Value> { Json(serde_json::json!({"status": "healthy"})) }

async fn count_text(Json(req): Json<CountRequest>) -> Json<CountResponse> {
    let words = req.text.split_whitespace().count() as u32;
    let characters = req.text.len() as u32;
    let sentences = req.text.matches(|c: char| c == '.' || c == '!' || c == '?').count() as u32;
    let paragraphs = req.text.split("\n\n").filter(|s| !s.trim().is_empty()).count() as u32;
    let minutes = words as f64 / 200.0;
    Json(CountResponse { words, characters, sentences, paragraphs, reading_time: format!("{:.1} min", minutes) })
}

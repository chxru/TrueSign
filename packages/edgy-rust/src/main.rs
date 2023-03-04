use std::time::{SystemTime, UNIX_EPOCH};

use photon_rs::{
    conv::edge_detection,
    filters::dramatic,
    native::{open_image, save_image},
};

fn main() {
    let mut img =
        open_image("./packages/edgy-rust/src/assets/desk.jpg").expect("Failed to open image");

    // grayscale the image
    dramatic(&mut img);

    // add gaussian blur
    // gaussian_blur(&mut img, 3_i32);

    // detect edges
    edge_detection(&mut img);

    let filename = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Failed to get timestamp")
        .as_millis();

    save_image(
        img,
        &format!("./packages/edgy-rust/src/assets/{}.jpg", filename),
    )
    .expect("Failed to save image");
}

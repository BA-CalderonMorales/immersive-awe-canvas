# Immersive Awe Canvas

A creative coding playground for crafting beautiful, interactive 3D worlds right in your browser.

<details>
<summary><b>What is this?</b></summary>

This project is a web-based application that allows users to explore and customize a series of pre-defined 3D scenes. It's built to be a simple, fun, and visually engaging experience. You can switch between different "worlds," change the time of day, and even tweak the scene parameters in real-time.
</details>

<details>
<summary><b>Quick Start</b></summary>

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/BA-CalderonMorales/immersive-awe-canvas.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd immersive-awe-canvas
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
    > **Note:** If you encounter an `ERESOLVE` error during `npm install` related to `vite` and `lovable-tagger`, it's because `lovable-tagger` currently requires an older version of `vite`. You can proceed by running:
    > ```bash
    > npm install --legacy-peer-deps
    > ```
    > This will install dependencies, but be aware that `lovable-tagger` might not be fully compatible with the newer `vite` version.

4.  **Start the development server:**
    ```bash
    npm start
    ```
This will start the application, and you can view it in your browser at the local address provided.
</details>

<details>
<summary><b>How to Contribute</b></summary>

Contributions are welcome! If you have ideas for new scenes, features, or improvements, feel free to open an issue or submit a pull request. When contributing, please try to follow the existing code style and structure.
</details>

<details>
<summary><b>Support the Project</b></summary>

If you find this project useful and want to support future development, consider buying me a coffee!

<a href="https://www.buymeacoffee.com/brandoncalderonmorales" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

</details>

<details>
<summary><b>Features</b></summary>

-   **World Hopping:** Navigate through a collection of unique 3D worlds.
-   **Diverse Worlds:** Explore scenes featuring various 3D objects like Torus Knots, a dynamic Distortion Sphere, and the Wavy Grid.
-   **Cinematic Transitions:** Experience seamless, unintrusive transitions between worlds for a fluid viewing experience.
-   **Dynamic Day/Night Cycle:** Toggle between day and night themes within each world.
-   **Freeze Scene:** Pause and resume all scene animations, including camera rotation and object movement.
-   **Mouse Controls:** Click and drag to look, scroll/pinch to zoom. Double-click to freeze the scene.
-   **Keyboard Shortcuts:** Navigate and control the experience with your keyboard.
    -   `N` / `P`: Next / Previous World
    -   `Space`: Toggle Theme
    -   `.` (Period): Freeze/Unfreeze scene animation
    -   `V`: Hide/Show UI
    -   `E`: Toggle Settings Panel / `Esc`: Close settings
    -   `S` or `Ctrl/Cmd+K`: Search
    -   `H`: Open Help Dialog
    -   `G`: Go to Home Page
    -   `C`: Copy Scene Configuration
-   **Live Scene Editor:** Click the settings icon to open a control panel (`lil-gui`) and adjust scene parameters like colors, materials, and object properties in real-time. The editor appears in a resizable side panel on desktop and a drawer on mobile. Now with more controls for materials and environment backgrounds!
-   **Copy Configuration:** Easily copy the JSON configuration of your customized scene to your clipboard.
-   **Supabase Integration:** World data is fetched from a Supabase backend.
-   **Responsive UI:** The interface is designed to work across different screen sizes.
</details>

<details>
<summary><b>Bugs & TODOs</b></summary>

-   [ ] Implement user authentication to enable features like issue reporting and liking worlds.
-   [ ] Add more worlds with diverse objects and backgrounds. (New object types added, more worlds to come!)
-   [ ] Implement a "save scene" feature for users.
-   [ ] Improve performance on lower-end devices.
-   [ ] Add more interactive elements to the scenes.
</details>

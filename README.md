
# Immersive Awe Canvas

A creative coding playground for crafting beautiful, interactive 3D worlds right in your browser.

<details>
<summary><b>What is this?</b></summary>

This project is a web-based application that allows users to explore and customize a series of pre-defined 3D scenes. It's built to be a simple, fun, and visually engaging experience. You can switch between different "worlds," change the time of day, and even tweak the scene parameters in real-time.
</details>

<details>
<summary><b>Quick Start</b></summary>

To run this project locally, you'll need [Node.js](https://nodejs.org/) and `npm` installed.

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_GIT_URL>
    cd <YOUR_PROJECT_NAME>
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```
This will start the application, and you can view it in your browser at the local address provided.
</details>

<details>
<summary><b>How to Contribute</b></summary>

Contributions are welcome! If you have ideas for new scenes, features, or improvements, feel free to open an issue or submit a pull request. When contributing, please try to follow the existing code style and structure.
</details>

<details>
<summary><b>Features</b></summary>

-   **World Hopping:** Navigate through a collection of unique 3D worlds.
-   **Diverse Worlds:** Explore scenes featuring various 3D objects like Torus Knots, Morphing Spheres, and the new Wavy Grid.
-   **Cinematic Transitions:** Experience seamless, unintrusive transitions between worlds for a fluid viewing experience.
-   **Dynamic Day/Night Cycle:** Press the `SPACE` bar to toggle between day and night themes within each world.
-   **Keyboard Shortcuts:** Navigate and control the experience with your keyboard.
    -   `N` / `P`: Next / Previous World
    -   `Space`: Toggle Theme
    -   `S`: Search
    -   `H`: Help
    -   `E`: Settings
    -   `G`: Home
    -   `V`: Hide/Show UI
-   **Live Scene Editor:** Click the settings icon to open a control panel (`lil-gui`) and adjust scene parameters like colors, materials, and object properties in real-time. The editor appears in a resizable side panel on desktop and a drawer on mobile. Now with more controls for materials!
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

# FED Assignment 2 (MokeSell)
MokeSell is an online marketplace where users can buy and sell second-hand items with ease. After signing up for an account, users can interact directly with each other through chats to discuss offers and negotiate deals. The platform allows users to browse listings, post their own items for sale, and view detailed product descriptions and seller reviews, helping them make informed and confident decisions. Users can also edit their profiles and customize their experience. Additionally, MokeSell offers an engaging 3D game where users can explore, earn points, and redeem rewards such as vouchers or spin a lucky wheel for exciting prizes.

View project live [here](https://razorbird360.github.io/FED-Assg02-MokeSell/)
[Figma Wireframe](https://www.figma.com/design/ortFTJMIqOdrWC8oJ5c03R/Checkpoint-1-Wireframe?node-id=0-1&t=5nsNpsJUPTElK20g-1)
View on:

- Laptop: 1920 x 1200
- Mobile: 932 x 430 (iPhone 14 Pro Max)
- Best viewed on Google Chrome

### Team Members
Ranen Sim | S10267339B  
Amir | S10267740H

### Run project locally
```shell
npm install
```
> This installs all dependencies listed under Technologies Used

```shell
npm run dev
```
> Used to run project locally. Alternatively, "npx vite" to run project, but it does not guarantee consistency with locally installed versions

```shell
npm run build
npm run serve
```
> Run build for production ready version & serve to preview the Web App

## Interactive Features
- 3D Exploration feature to find items and interact with other users



### Existing Features
- Account management - Allows users to create accounts with google and edit details of their account. Also allow to reset password.
- Gamification - Allows users to immerse in a 3D shopping experience and earn points by buying/selling items and redeeming rewards.
- Listing management - Allows users to create listings.
- Communication - Allows users to interact with one another.
- Feedback - Allows users to give reviews and feedback which can be used for potential customers to refer t0.
- Favourites - Allows users to save items of interests to view later.
- Search browsing and categories - Allows users to filter their searches to get what they specifically are looking for.
- Promotion - Interactive carousel with rewards page.
- Categories - Premade categories for user selection.
- Extra info - Mokesell Reviews, About Us, WishList Wednesday.


## Design Process  
We wanted to provide an intuitive user experience while being aesthetic 
- As a buyer, I want to create an account so that I can start browsing and purchasing items.
- As a seller, I want to create a listing for an item so that I can offer it for sale to other users.
- As a seller, I want to upload photos of my item so that buyers can see the product clearly.
- As a buyer, I want to chat with a seller so that I can ask questions and discuss offers before making a purchase.
- As a user, I want to be able to view product descriptions and seller reviews so that I can make an informed decision before buying.
- As a seller, I want to promote my listings by bumping them so that they appear higher in search results.
- As a buyer, I want to save listings that interest me so that I can come back and view them later.
- As a user, I want to edit my profile so that I can keep my account details up-to-date.
- As a user, I want to access a 3D game where I can explore and earn points so that I can have fun and redeem rewards.
- As a buyer or seller, I want to leave a review for a transaction so that I can share my experience with others.
- As a user, I want to submit feedback on the platform so that I can report any issues or suggest improvements.


## Roles
### Ranen (Full Stack Developer)
Full stack developer responsible for making the front end interfaces and also the backened like databases and etc.
### Amir (Front End Developer)
Front end developer responsible for the design and user interactions of the web page

## Technologies Used
- [Three.js](https://threejs.org/)
    - Used for 3D immersive experience
- [Firebase](http://firebase.google.com/) 
    - Used to simplify api usage for database
- [Vite](https://vite.dev/)
    - A fast build tool and development server that offers quick hot module replacement and fast build times for web apps.
- [Cannon-es](https://github.com/pmndrs/cannon-es)
    - Library used for 3D physics engine
- [Three.interactive](https://github.com/markuslerner/THREE.Interactive)
    - Three.js library to allow mouse interaction
- [Vanilla-tint](https://github.com/micku7zu/vanilla-tilt.js)
    - Used for css
- [UUID](https://www.npmjs.com/package/uuid)
    - Generate unique identifiers for usage in the website
- [Cloudflare](https://www.cloudflare.com/)
    - Used charts to create the spinwheel
## Assitive AI
These are the list of AI used for debugging purposes
- ChatGPT
- Deepseek
- Qwen
### Spinwheel page
- The spinwheel was adapted from [here](https://www.codingartistweb.com/)
- The confetti animation when the wheelspin stops is found [here](https://bit.ly/3lJQT6h)
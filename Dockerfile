# Step 1: Build the React app first with "npm run build" (creates the dist folder)
FROM nginx:alpine
# Step 2: Copy the built files into the nginx web folder
COPY dist /usr/share/nginx/html
# Step 3: nginx config so that React routes (refresh on /login etc.) work
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

FROM node:18


WORKDIR /src


COPY package*.json ./


RUN npm install


RUN npm install -g typescript


COPY . .


RUN npm run build


RUN npx prisma generate


EXPOSE 3000


ENV DATABASE_URL=postgresql://bkashishh07:WrIzv49gynwO@ep-square-dew-a5fv8u6f.us-east-2.aws.neon.tech/Bitespeed?sslmode=require


CMD ["npm", "start"]

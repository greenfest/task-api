import {defineStore} from 'pinia';

export const useQuotesStore = defineStore('quotes', {
    state: () => ({
        quotes: [
            {
                author: "Aristotle",
                content: "It is during our darkest moments that we must focus to see the light."
            },
            {
                author: "Mother Teresa",
                content: "Spread love everywhere you go. Let no one ever come to you without leaving happier."
            },
            {
                author: "Franklin D. Roosevelt",
                content: "The only thing we have to fear is fear itself."
            },
            {
                author: "Martin Luther King Jr.",
                content: "Darkness cannot drive out darkness: only light can do that. Hate cannot drive out hate: only love can do that."
            },
            {
                author: "Eleanor Roosevelt",
                content: "Do one thing every day that scares you."
            },
            {
                author: "Benjamin Franklin",
                content: "Well done is better than well said."
            },
            {
                author: "Helen Keller",
                content: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart."
            },
            {
                author: "Ralph Waldo Emerson",
                content: "Do not go where the path may lead, go instead where there is no path and leave a trail."
            },
            {
                author: "Oscar Wilde",
                content: "Be yourself; everyone else is already taken."
            },
        ]
    }),
    getters: {
        getRandomQuote: (state) => {
            const index = Math.floor(Math.random() * (state.quotes.length));
            return state.quotes[index];
        },
    },
});
<script setup lang="ts">
import { ClockHour4Icon, MessageCircle2Icon } from 'vue-tabler-icons';
import { format, parseISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { useQuotesStore } from "~/store/quotes";

interface Quote {
  author: string,
  content: string
}

const { getRandomQuote } = useQuotesStore();

let quote: Quote = getRandomQuote;

const date = ref(new Date().toISOString());

function formatDateTimeToLocal(dateTimeString: any) {
  const utcDateTime = parseISO(dateTimeString);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedDateTime = utcToZonedTime(utcDateTime, timeZone);

  return format(zonedDateTime, 'dd MMMM yyyy');
}

</script>

<template>
  <VCard elevation="10" class="overflow-hidden">
    <img style="width: 100%" src="/images/backgrounds/u5.jpg"  alt=""/>
    <v-card-text>
      <h3 class="text-h6 d-flex align-center">
        <ClockHour4Icon class="mr-1" size="20"/>
        {{ formatDateTimeToLocal(date) }}
      </h3>
      <h5 class="mb-2 mt-5 text-h5">
        {{ quote.content }}
      </h5>
      <v-chip class="mr-2" label="" size="small" color="primary"> {{ quote.author }} </v-chip>
      <v-divider class="mt-7"></v-divider>
      <div class="d-flex align-center mt-4">
        <v-avatar size="40">
          <img width="40" src="/images/profile/1.jpg" alt="John" />
        </v-avatar>
        <v-avatar size="40" class="ml-2">
          <img width="40" src="/images/profile/2.jpg" alt="John" />
        </v-avatar>
        <v-avatar size="40" class="ml-2">
          <img width="40" src="/images/profile/3.jpg" alt="John" />
        </v-avatar>
        <div class="ml-auto">
          <v-btn icon variant="flat">
            <v-avatar size="large" class="textSecondary">
                        <MessageCircle2Icon size="22" />
                    </v-avatar>
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </VCard>
</template>

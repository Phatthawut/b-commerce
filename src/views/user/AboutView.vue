<template>
  <div class="font-thai -mt-2 bg-white text-black">
    <Hero :imageSrc="heroImage" imageAlt="About Hero Image" />
    <div class="container relative mx-auto px-4 font-thai">
      <div class="flex flex-col items-center gap-8 mx-auto px-4">
        <div>
          <h2 class="text-4xl font-semibold font-montserrat pt-12">
            About the Author
          </h2>
        </div>
        <div class="border-t-2 border-[#8ebcc2] w-64"></div>

        <div class="mx-auto px-6 pt-4 pb-12">
          <div class="relative">
            <!-- Top-left border -->
            <div class="absolute bottom-0 left-0">
              <div class="border-l-4 border-borderline h-32"></div>
              <div class="border-t-4 border-borderline w-32"></div>
            </div>

            <!-- Bottom-right border -->
            <div class="absolute top-0 right-0">
              <div class="border-t-4 border-borderline w-32"></div>
              <div class="border-r-4 border-borderline h-32"></div>
            </div>

            <!-- Content -->
            <div
              class="flex flex-col gap-6 justify-center items-center py-12 px-4 bg-mainbg max-w-[1300px] mx-auto"
            >
              <h3 class="text-xl font-bold italic mb-2 font-merriweather">
                Dr. Vuthiphong Priebjrivat
              </h3>
              <p class="px-4 text-sm md:text-lg font-montserrat">
                After having ranked first in Thailand’s national examination in
                1970, Woody went to the United States to further his education
                under the patronage of the King’s Scholarship of Thailand and
                the Rockefeller Scholarships. He received a B.S. in civil
                engineering from M.I.T. (1975); an M.S. in environmental
                engineering from Stanford University (1976); as well as an
                M.B.A. and a Ph.D. in economics and public management from the
                University of Chicago (1979 and 1984).
              </p>
              <p class="px-4 text-sm md:text-lg font-montserrat">
                Woody has been quite successful in a rather diverse career
                spanning roughly four decades: as a university professor,
                corporate executive, law maker, political critic, religious
                scholar, public speaker and best-selling author. His deep
                interest in eastern religions and metaphysics together with a
                brief period of monkhood, when coupled with his rigorous
                scientific background, culminated in a series of books
                concerning the interconnections between modern science and the
                age-old wisdom of dharma: Dharmadynamics (2004), Neodharma (2012
                and 2020), Dharmoscience (2012 and 2020), Sankhara (2014 and
                2020) and Nirvana (2024) At present, he regularly lectures on
                the subject matter to monks and the lay public alike, both in
                Thailand and overseas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Hero from "@/components/hero/Hero.vue";
import heroImage from "@/assets/images/Dr-Vuthiphong-Priebjrivat.webp";
</script>

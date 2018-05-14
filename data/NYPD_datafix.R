rm(list = ls())
setwd("C:/Users/kshll/Dropbox/AK DTU/Social Data Analysis/Final project/Babs/data")
cat('Install and load packages...')
to_only_install <- c()

to_install_and_load <- c(
  'data.table',  # data.table objects
  'stringr',     # str_c
  'tidyr',       # gather
  'lubridate',   # months(), %+m% | should be loaded after data.table
  'RPostgreSQL', #
  'plyr',        # laply
  'dplyr',        # %>%, rename, transmute # should be loaded after plyr
  'ggplot2',
  'sp',
  'tidyverse',
  'xtable',
  'Rsolnp',
  'nlme',
  'nlme', # Mixed effects linear models
  'lme4', # package for generalized mixed effects linear models
  'car',
  'latex2exp',
  'psych',
  'corrplot',
  'jsonlite',
  'reshape2'
)
to_install <- c(to_only_install, to_install_and_load)
installed  <- rownames(installed.packages())
for(p in to_install) if(! p %in% installed) install.packages(p, depend=TRUE)
for(p in to_install_and_load) require(p, character.only=TRUE)
cat(' Packages loaded.',fill = T)

dat <- read.csv('NYPD_complaints.csv', stringsAsFactors = F, sep = ',') %>% data.table()

pop_n <- c(1471160, 2648771, 1664727, 2358582, 479458)

dat %>% select(-CMPLNT_FR_TM, -CMPLNT_TO_TM, -CMPLNT_TO_DT, -KY_CD, -PD_CD, -CRM_ATPT_CPTD_CD, -LOC_OF_OCCUR_DESC, -ADDR_PCT_CD,
                -PREM_TYP_DESC, -PARKS_NM, -HADEVELOPT, -X_COORD_CD, -Y_COORD_CD, -Latitude, -Longitude, -Lat_Lon, -PD_DESC, -PD_CD) %>%
                mutate(counts = 1) -> data1

data1 %>% group_by(BORO_NM, LAW_CAT_CD) %>%  summarise(sum_counts = sum(counts)) %>% ungroup() %>% data.table() %>%
          mutate(population = ifelse(BORO_NM == 'BRONX', pop_n[1], ifelse(BORO_NM == 'BROOKLYN', pop_n[2],
                                                                   ifelse(BORO_NM == 'MANHATTAN', pop_n[3],
                                                                   ifelse(BORO_NM == 'QUEENS', pop_n[4], pop_n[5]
                                                                   ))))) %>% mutate(norm_counts = sum_counts/population) -> data2
total_comp <- sum(data2$sum_counts)

data2 %>% group_by(LAW_CAT_CD) %>% summarise(sum_comp = sum(sum_counts)) %>% ungroup() %>% data.table() -> blabla

fel_pct <- blabla$sum_comp[1]/total_comp*100
mis_pct <- blabla$sum_comp[2]/total_comp*100
vio_pct <- blabla$sum_comp[3]/total_comp*100


data3 <- dcast(data2,BORO_NM~LAW_CAT_CD, value.var = 'norm_counts', fill = 0) %>% data.table() %>% 
  mutate(Borough = BORO_NM, TOTAL = FELONY + MISDEMEANOR + VIOLATION) %>% select(-BORO_NM)
setcolorder(data3, c(4,1,2,3,5))

bronx <- filter(data3, Borough == 'BRONX')
brooklyn <- filter(data3, Borough == 'BROOKLYN')
manhattan <- filter(data3, Borough == 'MANHATTAN')
queens <- filter(data3, Borough == 'QUEENS')
staten_island <- filter(data3, Borough == 'STATEN ISLAND')

write.csv(data3, "NYPD_complaints_normcounts.csv", quote = F, row.names = F)

write.csv(bronx, "bronx.csv", quote = F, row.names = F)
write.csv(brooklyn, "brooklyn.csv", quote = F, row.names = F)
write.csv(manhattan, "manhattan.csv", quote = F, row.names = F)
write.csv(queens, "queens.csv", quote = F, row.names = F)
write.csv(staten_island, "staten_island.csv", quote = F, row.names = F)




#write(exportJson, "Data/complaint_sample1.json")






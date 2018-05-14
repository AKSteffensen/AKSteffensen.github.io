rm(list = ls())
# setwd("C:/Users/kshll/Dropbox/AK DTU/Advanced data analysis")
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
  'jsonlite'
)
to_install <- c(to_only_install, to_install_and_load)
installed  <- rownames(installed.packages())
for(p in to_install) if(! p %in% installed) install.packages(p, depend=TRUE)
for(p in to_install_and_load) require(p, character.only=TRUE)
cat(' Packages loaded.',fill = T)

setwd('C:/Users/kshll/Dropbox/AK DTU/Social data analysis/Final Project')

data <- read.csv('Data/complaint_sample.csv', stringsAsFactors = F, sep = ';') %>% data.table()

data <- data %>% mutate(CreatedDate = as.Date(Created.Date, format = '%m/%d/%Y'), 
                        ClosedDate = as.Date(Closed.Date, format = '%m/%d/%Y'),
                        Time = substr(sub("^\\S+\\s+", '', Created.Date),1 , 2),
                        AMPM = substr(Created.Date,21 , 22)
                        ) %>%
                          transmute(CreatedDate, ClosedDate, Time, AMPM, Longitude, Latitude, Agency, Borough) %>%
                          mutate(Time = ifelse(Time != '12' & AMPM == 'PM', as.numeric(Time)+12, as.numeric(Time)), 
                                 Time = ifelse(Time == 12 & AMPM == 'AM', Time-12, Time)) %>% select(-AMPM)

data2 <- data[!is.na(data$Latitude),]
data2 <- data2[!is.na(data2$Longitude),]

# data2 <- unique(data2)
# 
# total <- rep(0, 4018) %>% data.table()
# total$Date <- seq(as.Date('2006-01-01'), as.Date('2016-12-31'), by = 'day')
# total$keep <- total$Date %in% data2$Date
# 
# total$sum_counts <- total$.
# total$. <- NULL
# total <- data.table(total) %>% filter(keep == FALSE) %>% select(-keep)
# setcolorder(total, c(2,1))
# 
# data3 <- rbind(data2, total) %>% data.table() %>% setorder(Date) %>% mutate(Date = as.character(Date)) 

exportJson <- toJSON(data, dataframe = 'rows')

write.csv(data2, "Data/complaint_sample2.csv", quote = F, row.names = F)

write(exportJson, "Data/complaint_sample1.json")






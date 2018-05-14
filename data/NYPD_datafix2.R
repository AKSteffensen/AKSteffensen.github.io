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
  'jsonlite',
  'reshape2'
)
to_install <- c(to_only_install, to_install_and_load)
installed  <- rownames(installed.packages())
for(p in to_install) if(! p %in% installed) install.packages(p, depend=TRUE)
for(p in to_install_and_load) require(p, character.only=TRUE)
cat(' Packages loaded.',fill = T)

dat <- read.csv('NYPD_complaints.csv', stringsAsFactors = F, sep = ',') %>% data.table()

dat %>% transmute(Borough = as.integer(as.factor(BORO_NM)), Complaint_ID = as.integer(KY_CD), Law_Category = as.integer(as.factor(LAW_CAT_CD)))  -> data2

par(mfrow=c(1,1))
# correlationplot with colors and numbers
M <- cor(data2[,c(1,2,3)])
corrplot.mixed(M, lower.col = "black", number.cex = .7, tl.cex = 0.7)



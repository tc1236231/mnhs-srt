library(tidyverse)

d_raw <- read_tsv("cat_map.tsv")

d <- d_raw %>%
    gather(category, ind, -User, -Site, -`Daily/Monthly Form`) %>%
    filter(ind == "x") %>%
    select(email = User,
           site = Site,
           reportFreq = `Daily/Monthly Form`,
           category,
           -ind) %>%
    arrange(email, site, reportFreq, category)

d %>% write_csv('users_table.csv')

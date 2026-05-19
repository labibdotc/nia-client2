import { LIBRARY } from './Onboarding.jsx';
/* Dashboard data — contacts, events, venues, functions categories, models */

const CONTACTS_DATA = [{"id": 1, "org": "Sunshine Sachs", "name": "Lauren Kelcher Stevenson", "email": "bbma@sunshinesachs.com", "email2": "", "site": "sunshinesachs.com", "note": ""}, {"id": 2, "org": "Sunshine Sachs", "name": "Maggie Faircloth", "email": "bbma@sunshinesachs.com", "email2": "", "site": "sunshinesachs.com", "note": ""}, {"id": 3, "org": "Sunshine Sachs", "name": "Pipere Boggio", "email": "bbma@sunshinesachs.com", "email2": "", "site": "sunshinesachs.com", "note": ""}, {"id": 4, "org": "Sunshine Sachs", "name": "Bryanna Vera", "email": "bbma@sunshinesachs.com", "email2": "", "site": "sunshinesachs.com", "note": ""}, {"id": 5, "org": "Sunshine Sachs", "name": "Bridget Cirone", "email": "bbma@sunshinesachs.com", "email2": "", "site": "sunshinesachs.com", "note": ""}, {"id": 6, "org": "Sunshine Sachs", "name": "Sarah Borchardt", "email": "bbma@sunshinesachs.com", "email2": "", "site": "sunshinesachs.com", "note": ""}, {"id": 7, "org": "Sunshine Sachs", "name": "NAACP Image Awards Desk", "email": "NAACPImageAwards@ssmandl.com", "email2": "", "site": "ssmandl.com", "note": "57th NAACP Image Awards – Feb 28"}, {"id": 8, "org": "Sunshine Sachs", "name": "Producers Guild Desk", "email": "producersguild@ssmandl.com", "email2": "", "site": "ssmandl.com", "note": "37th Producers Guild Awards – Feb 28"}, {"id": 9, "org": "Sunshine Sachs", "name": "Mercedes Smith (NAACP)", "email": "naacpimageawards@sunshinesachs.com", "email2": "", "site": "sunshinesachs.com", "note": "NAACP Image Awards – Sunshine Sachs lead"}, {"id": 10, "org": "MRC", "name": "Emily Spence", "email": "espence@mrcentertainment.com", "email2": "", "site": "mrcentertainment.com", "note": ""}, {"id": 11, "org": "MRC", "name": "Kristin Robinson", "email": "krobinson@mrcentertainment.com", "email2": "", "site": "mrcentertainment.com", "note": ""}, {"id": 12, "org": "MRC", "name": "Leah Palacios", "email": "lpalacios@mrcentertainment.com", "email2": "", "site": "mrcentertainment.com", "note": ""}, {"id": 13, "org": "NBC", "name": "Ryan McCormick", "email": "ryan.mccormick@nbcuni.com", "email2": "", "site": "nbcuni.com", "note": ""}, {"id": 14, "org": "NBC", "name": "Mariana Duran", "email": "mariana.duran@nbcuni.com", "email2": "", "site": "nbcuni.com", "note": ""}, {"id": 15, "org": "NBC", "name": "Melissa Cuasito", "email": "melissa.cuasito@nbcuni.com", "email2": "", "site": "nbcuni.com", "note": ""}, {"id": 16, "org": "NBC", "name": "Jaime Weinreb", "email": "jaime.weinreb@nbcuni.com", "email2": "", "site": "nbcuni.com", "note": ""}, {"id": 17, "org": "NBC", "name": "Jennifer Black", "email": "Jennifer.Black@nbcuni.com", "email2": "", "site": "nbcuni.com", "note": "VP Global Publicity – Jurassic World Rebirth"}, {"id": 18, "org": "Apple", "name": "Jessica Bass", "email": "jessica_bass@apple.com", "email2": "", "site": "apple.com", "note": "Apple Music Radio; Super Bowl Halftime"}, {"id": 19, "org": "Apple", "name": "Haley Agurs", "email": "hagurs@apple.com", "email2": "", "site": "apple.com", "note": "Apple TV+"}, {"id": 20, "org": "Apple", "name": "Stephanie Sommer", "email": "ssommer@apple.com", "email2": "", "site": "apple.com", "note": "Apple TV+"}, {"id": 21, "org": "Apple", "name": "Media Helpline", "email": "media.help@apple.com", "email2": "", "site": "apple.com", "note": "Apple Original Films (F1)"}, {"id": 22, "org": "42West", "name": "Fantasy Life Desk", "email": "fantasylife@42west.com", "email2": "", "site": "42west.com", "note": "Fantasy Life [Greenwich Ent.]"}, {"id": 23, "org": "42West", "name": "Greenwich Desk", "email": "greenwich@42west.com", "email2": "", "site": "42west.com", "note": "Diane Warren: Relentless"}, {"id": 24, "org": "42West", "name": "CBS Primetime", "email": "cbsprimetime@42west.com", "email2": "", "site": "42west.com", "note": "Marshals / CBS"}, {"id": 25, "org": "42West", "name": "Slamdance", "email": "Slamdance@42west.com", "email2": "", "site": "42west.com", "note": "Slamdance Film Festival – Feb 18-25"}, {"id": 26, "org": "42West", "name": "Mr. Nobody Desk", "email": "mrnobody@42west.com", "email2": "", "site": "42west.com", "note": "Mr. Nobody Against Putin [Kino Lorber]"}, {"id": 27, "org": "42West", "name": "Kokuho Desk", "email": "teamkokuho@42west.com", "email2": "", "site": "42west.com", "note": "Kokuho [GKids]"}, {"id": 28, "org": "42West", "name": "Puppy Bowl Desk", "email": "Teampuppybowl@42west.com", "email2": "", "site": "42west.com", "note": "Puppy Bowl XXII – Animal Planet/Discovery"}, {"id": 29, "org": "Accolade PR", "name": "Team Inbox", "email": "Team@AccoladePR.com", "email2": "", "site": "accoladepr.com", "note": "ARCO, Secret Agent, Sirāt, Smashing Machine [NEON/A24]; Vidiots"}, {"id": 30, "org": "APEX Public Relations", "name": "Shawn Purdy", "email": "TonyAwardsPR@theapex-pr.com", "email2": "", "site": "theapex-pr.com", "note": "Tony Awards"}, {"id": 31, "org": "APEX Public Relations", "name": "Elyse Weissman", "email": "TonyAwardsPR@theapex-pr.com", "email2": "", "site": "theapex-pr.com", "note": "Tony Awards"}, {"id": 32, "org": "APEX Public Relations", "name": "Andy Gelb", "email": "andy@theapex-pr.com", "email2": "", "site": "theapex-pr.com", "note": "Vanity Fair Oscar Party; MPTF Night Before Oscars"}, {"id": 33, "org": "APEX Public Relations", "name": "Julia Rossen", "email": "julia@theapex-pr.com", "email2": "", "site": "theapex-pr.com", "note": "Vanity Fair Oscar Party; MPTF Night Before Oscars"}, {"id": 34, "org": "APEX Public Relations", "name": "Lindsey Brown", "email": "lindsey@theapex-pr.com", "email2": "", "site": "theapex-pr.com", "note": "37th GLAAD Media Awards – March 5"}, {"id": 35, "org": "A24", "name": "Press Desk", "email": "news@a24films.com", "email2": "", "site": "a24films.com", "note": "Marty Supreme; The Drama (Zendaya)"}, {"id": 36, "org": "A24", "name": "Claire Colletti", "email": "claire@a24films.com", "email2": "", "site": "a24films.com", "note": "If I Had Legs I'd Kick You"}, {"id": 37, "org": "American Cinematheque", "name": "Publicity", "email": "publicity@americancinematheque.com", "email2": "", "site": "americancinematheque.com", "note": "Timothee Chalamet Retro; Chloe Zhao; Train Dreams; The Natural"}, {"id": 38, "org": "Warner Bros. / WBD", "name": "Veronica Van Pelt", "email": "Veronica.VanPelt@wbd.com", "email2": "", "site": "wbd.com", "note": "VP Media Relations – HBO Docs; Alabama Solution"}, {"id": 39, "org": "Warner Bros. / WBD", "name": "Hayley Hanson", "email": "Hayley.Hanson@wbd.com", "email2": "", "site": "wbd.com", "note": "Manager Media Relations – HBO Docs"}, {"id": 40, "org": "Warner Bros. / WBD", "name": "Cortney Lawson", "email": "teamlawsonmedia@wbd.com", "email2": "", "site": "wbd.com", "note": "One Battle After Another"}, {"id": 41, "org": "Warner Bros. / WBD", "name": "DJ Jean", "email": "dj.jean@wbd.com", "email2": "", "site": "wbd.com", "note": "Sinners"}, {"id": 42, "org": "Warner Bros. / WBD", "name": "Chelsey Riemann", "email": "chelsey.riemann@wbd.com", "email2": "", "site": "wbd.com", "note": "Property Brothers: Under Pressure [HGTV]"}, {"id": 43, "org": "Warner Bros. / WBD", "name": "Lynne Davis", "email": "lynne.davis@wbd.com", "email2": "", "site": "wbd.com", "note": "Property Brothers: Under Pressure [HGTV]"}, {"id": 44, "org": "Netflix", "name": "Frankenstein Desk", "email": "frankensteinpublicity@netflix.com", "email2": "", "site": "netflix.com", "note": "Frankenstein"}, {"id": 45, "org": "Netflix", "name": "Sabryna Phillips", "email": "Sphillips@netflix.com", "email2": "", "site": "netflix.com", "note": "Sex, Lies, and Videotape / LAFCA"}, {"id": 46, "org": "Netflix", "name": "Nicole Player", "email": "nplayer@netflix.com", "email2": "", "site": "netflix.com", "note": "Sex, Lies, and Videotape / LAFCA"}, {"id": 47, "org": "Netflix", "name": "SAG Awards PR Desk", "email": "sagawards-pr@netflix.com", "email2": "", "site": "netflix.com", "note": "32nd SAG Awards on Netflix"}, {"id": 48, "org": "Disney", "name": "Domestic Press", "email": "wds.events.rsvp@disney.com", "email2": "", "site": "disney.com", "note": "Elio, Zootopia 2, Avatar – broadcast/print/Hispanic"}, {"id": 49, "org": "Disney", "name": "International Press", "email": "wdsmpi.publicity.rsvp@disney.com", "email2": "", "site": "disney.com", "note": "Elio, Zootopia 2, Avatar – international"}, {"id": 50, "org": "Disney", "name": "Photo Desk", "email": "wds.photorsvp@disney.com", "email2": "", "site": "disney.com", "note": "Elio, Zootopia 2, Avatar – photographers"}, {"id": 51, "org": "Disney", "name": "Chelsie Tanamachi", "email": "chelsie.m.tanamachi@disney.com", "email2": "", "site": "disney.com", "note": "ABC Media Relations – Oscars broadcast"}, {"id": 52, "org": "Focus Features", "name": "Press Desk", "email": "info@focusfeatures.com", "email2": "", "site": "focusfeatures.com", "note": "Bugonia; Hamnet; Song Sung Blue"}, {"id": 53, "org": "NEON", "name": "Ezra Scott-Henning", "email": "ezra@neonrated.com", "email2": "", "site": "neonrated.com", "note": "It Was Just An Accident"}, {"id": 54, "org": "Oscars / Academy", "name": "Publicity", "email": "publicity@oscars.org", "email2": "", "site": "oscars.org", "note": "98th Oscars – general press"}, {"id": 55, "org": "Oscars / Academy", "name": "Credentials", "email": "credentials@oscars.org", "email2": "", "site": "oscars.org", "note": "98th Oscars – media credentials"}, {"id": 56, "org": "Oscars / Academy", "name": "Natalie Kojen", "email": "nkojen@oscars.org", "email2": "", "site": "oscars.org", "note": "Academy Communications"}, {"id": 57, "org": "Oscars / Academy", "name": "Museum Press", "email": "museumpress@oscars.org", "email2": "", "site": "oscars.org", "note": "Academy Museum; Star Trek IV screening"}, {"id": 58, "org": "Recording Academy / GRAMMYs", "name": "Communications", "email": "communications@grammy.com", "email2": "", "site": "grammy.com", "note": "68th GRAMMYs – general"}, {"id": 59, "org": "Recording Academy / GRAMMYs", "name": "Britta Purcell", "email": "britta.purcell@grammy.com", "email2": "", "site": "grammy.com", "note": "P&E Wing Grammy Week Celebration"}, {"id": 60, "org": "Recording Academy / GRAMMYs", "name": "Rachel Friedman", "email": "rachel.friedman@grammy.com", "email2": "", "site": "grammy.com", "note": "Entertainment Law Initiative Luncheon"}, {"id": 61, "org": "GRAMMY Museum", "name": "Media Desk", "email": "media@grammymuseum.org", "email2": "jlywen-dill@grammymuseum.org", "site": "grammymuseum.org", "note": "Grammy Week events; After Party"}, {"id": 62, "org": "GRAMMY Museum", "name": "Jasmine Lywen-Dill", "email": "jlywen-dill@grammymuseum.org", "email2": "media@grammymuseum.org", "site": "grammymuseum.org", "note": "Director of Communications"}, {"id": 63, "org": "PMK Entertainment", "name": "Grammy RSVP", "email": "GrammyAwards@pmkentertainment.com", "email2": "", "site": "pmkentertainment.com", "note": "Grammy Awards media RSVP"}, {"id": 64, "org": "PMK Entertainment", "name": "Caroline Stegner", "email": "caroline.stegner@pmkentertainment.com", "email2": "", "site": "pmkentertainment.com", "note": "Recording Academy Honors RSVP"}, {"id": 65, "org": "DKC News", "name": "Caroline Stegner", "email": "caroline_stegner@dkcnews.com", "email2": "", "site": "dkcnews.com", "note": "28th Costume Designers Guild Awards – Feb 12"}, {"id": 66, "org": "DKC News", "name": "Joe Schneider", "email": "joe_schneider@dkcnews.com", "email2": "", "site": "dkcnews.com", "note": "28th Costume Designers Guild Awards"}, {"id": 67, "org": "DKC News", "name": "Madison Thomas", "email": "madison_thomas@dkcnews.com", "email2": "", "site": "dkcnews.com", "note": "28th Costume Designers Guild Awards"}, {"id": 68, "org": "LA Philharmonic", "name": "Leah Price", "email": "leah.price@laphil.org", "email2": "", "site": "laphil.org", "note": "Concerts at Walt Disney Concert Hall"}, {"id": 69, "org": "LA Philharmonic", "name": "Lev Mamuya", "email": "lev.mamuya@laphil.org", "email2": "", "site": "laphil.org", "note": "Dudamel / Beethoven – Cate Blanchett"}, {"id": 70, "org": "Hunter PR", "name": "Don Julio Desk", "email": "DONJULIO@HUNTERPR.COM", "email2": "", "site": "hunterpr.com", "note": "Don Julio brand"}, {"id": 71, "org": "Epic Records", "name": "Publicity Desk", "email": "EPICPUBLICITY@EPICRECORDS.COM", "email2": "", "site": "epicrecords.com", "note": ""}, {"id": 72, "org": "Jensen Communications", "name": "Michael Jensen", "email": "mj@jensencom.com", "email2": "", "site": "jensencom.com", "note": "FestForums – Feb 11 Santa Barbara"}, {"id": 73, "org": "Jensen Communications", "name": "Leo Lavoro", "email": "leo@jensencom.com", "email2": "", "site": "jensencom.com", "note": "FestForums"}, {"id": 74, "org": "FestForums", "name": "Laurie Kirby", "email": "Laurie@festforums.com", "email2": "", "site": "festforums.com", "note": "Feb 11 – Mar Monte Hotel, Santa Barbara"}, {"id": 75, "org": "K-Star PR / De Castellane Creative", "name": "Asst Desk", "email": "asst@K-StarPR.com", "email2": "", "site": "k-starpr.com", "note": "TikTok Live concert (Las Vegas); Songtrybe launch"}, {"id": 76, "org": "K-Star PR / De Castellane Creative", "name": "Daniel", "email": "daniel@decastellanecreative.com", "email2": "", "site": "decastellanecreative.com", "note": "Media/press attendance"}, {"id": 77, "org": "K-Star PR / De Castellane Creative", "name": "Press/Talent", "email": "press@decastellanecreative.com", "email2": "", "site": "decastellanecreative.com", "note": "Talent submissions"}, {"id": 78, "org": "Perception PR", "name": "Matthew Jordan", "email": "matthew@perceptionpr.com", "email2": "", "site": "perceptionpr.com", "note": "76th ACE Eddie Awards; 73rd Golden Reel Awards"}, {"id": 79, "org": "Perception PR", "name": "Natasha Barrett", "email": "natasha@perceptionpr.com", "email2": "", "site": "perceptionpr.com", "note": "73rd Golden Reel Awards"}, {"id": 80, "org": "Perception PR", "name": "Lea Yardum", "email": "lea@perceptionpr.com", "email2": "", "site": "perceptionpr.com", "note": "ACE Eddie Awards; Golden Reel Awards"}, {"id": 81, "org": "MusiCares", "name": "Jessica Carmona", "email": "jessica.carmona@musicares.org", "email2": "", "site": "musicares.org", "note": "35th Person of the Year – Mariah Carey, Jan 30"}, {"id": 82, "org": "The Oriel Co.", "name": "Chloe Walsh", "email": "chloe@theoriel.co", "email2": "", "site": "theoriel.co", "note": "Jason Isbell"}, {"id": 83, "org": "The Oriel Co.", "name": "UnitedMasters", "email": "UMGrammy2026@theoriel.co", "email2": "", "site": "theoriel.co", "note": "UnitedMasters GRAMMY party – Hollywood Palladium"}, {"id": 84, "org": "Shore Fire Media", "name": "ASCAP Desk", "email": "ascapexperience@shorefire.com", "email2": "", "site": "shorefire.com", "note": "ASCAP Experience conference – Feb 12"}, {"id": 85, "org": "Reybee PR", "name": "Rey Roldan", "email": "rey@reybee.com", "email2": "", "site": "reybee.com", "note": "Eddie Schwartz"}, {"id": 86, "org": "Reybee PR", "name": "Heather Hawke", "email": "heather@reybee.com", "email2": "", "site": "reybee.com", "note": "Eddie Schwartz"}, {"id": 87, "org": "Atom Splitter PR", "name": "Press Desk", "email": "press@atomsplitterpr.com", "email2": "", "site": "atomsplitterpr.com", "note": "Buckcherry"}, {"id": 88, "org": "BT PR", "name": "Olga Makrias", "email": "Olga@btpr.biz", "email2": "", "site": "btpr.biz", "note": "Dermot Kennedy – The Weight of the Woods"}, {"id": 89, "org": "BT PR", "name": "Benny Tarantini", "email": "Benny@btpr.biz", "email2": "", "site": "btpr.biz", "note": "Dermot Kennedy"}, {"id": 90, "org": "117 Group", "name": "Zach Farnum", "email": "zach@117group.com", "email2": "", "site": "117group.com", "note": "Dan Seals Estate"}, {"id": 91, "org": "117 Group", "name": "Taylor Steele", "email": "taylor@117group.com", "email2": "", "site": "117group.com", "note": "Dan Seals Estate"}, {"id": 92, "org": "KMJ PR", "name": "Kim Jakwerth", "email": "kim@kmjpr.com", "email2": "", "site": "kmjpr.com", "note": "Dan Seals Estate"}, {"id": 93, "org": "Anderson Group PR", "name": "Whitney & Caitlin", "email": "AGPR@AndersonGroupPR.com", "email2": "", "site": "andersongrouppr.com", "note": "Karimah Westbrook – All American / Dream House"}, {"id": 94, "org": "Tribeca Film Festival", "name": "Festival Press", "email": "festivalpress@tribecafilm.com", "email2": "", "site": "tribecafilm.com", "note": "June 3-14, 2026 – 25th Anniversary"}, {"id": 95, "org": "The Mesulam Group", "name": "Shari Mesulam", "email": "shari@themesulamgroup.com", "email2": "", "site": "themesulamgroup.com", "note": "40th AFI Fest; AFI Life Achievement Award – Eddie Murphy"}, {"id": 96, "org": "Break White Light", "name": "Stephanie Goodell", "email": "stephanie@breakwhitelight.com", "email2": "", "site": "breakwhitelight.com", "note": "Television Academy – 78th Emmy Awards, Sept 14"}, {"id": 97, "org": "Film Independent", "name": "Publicity", "email": "publicity@filmindependent.org", "email2": "", "site": "filmindependent.org", "note": "41st Spirit Awards – Feb 15"}, {"id": 98, "org": "Costa Communications", "name": "Ray Costa", "email": "rcosta@costacomm.com", "email2": "", "site": "costacomm.com", "note": "2026 SCL Awards – Feb 6"}, {"id": 99, "org": "Costa Communications", "name": "Rebekah Alperin", "email": "ralperin@costacomm.com", "email2": "", "site": "costacomm.com", "note": "2026 SCL Awards"}, {"id": 100, "org": "Houser PR", "name": "Gretchen Houser", "email": "Gretchen@houserpr.com", "email2": "", "site": "houserpr.com", "note": "53rd Annie Awards – ASIFA-Hollywood, Feb 21"}, {"id": 101, "org": "Right On! PR", "name": "Sheila Kenny", "email": "sheila@rightonpr.com", "email2": "", "site": "rightonpr.com", "note": "Kyle Gass Band"}, {"id": 102, "org": "Raz Public Relations", "name": "Shannon Deoul", "email": "shannon@razpr.com", "email2": "", "site": "razpr.com", "note": "24th VES Awards – Feb 25"}, {"id": 103, "org": "Smithhouse Strategy", "name": "CSA Desk", "email": "csa@smithhousestrategy.com", "email2": "", "site": "smithhousestrategy.com", "note": "Casting Society – 41st Artios Awards – Feb 26"}, {"id": 104, "org": "Print Shop PR", "name": "Matt Ross", "email": "Matt@printshoppr.com", "email2": "", "site": "printshoppr.com", "note": "Artios Awards – New York"}, {"id": 105, "org": "Print Shop PR", "name": "Liz Lombardi", "email": "Liz@printshoppr.com", "email2": "", "site": "printshoppr.com", "note": "Artios Awards – New York"}, {"id": 106, "org": "Solters PR", "name": "Sam Threadgill", "email": "sthreadgill@solters.com", "email2": "", "site": "solters.com", "note": "Agua Caliente Casino – Jeff Foxworthy, Brad Paisley, Collective Soul"}, {"id": 107, "org": "Solters PR", "name": "Anna Loynes", "email": "aloynes@solters.com", "email2": "", "site": "solters.com", "note": "Kia Forum / New Edition Way Tour"}, {"id": 108, "org": "Tre Media", "name": "Tresa Sanders", "email": "tresa@tre-media.net", "email2": "", "site": "tre-media.net", "note": "Black Promoters Collective; New Edition Way Tour"}, {"id": 109, "org": "Tre Media", "name": "Daylan Cole", "email": "Daylan@Tre-media.net", "email2": "", "site": "tre-media.net", "note": "Black Promoters Collective; New Edition Way Tour"}, {"id": 110, "org": "JMigs PR", "name": "JoAnn Mignano", "email": "jo@jmigspr.com", "email2": "", "site": "jmigspr.com", "note": "Boyz II Men"}, {"id": 111, "org": "The Chamber Group", "name": "Juliana Plotkin", "email": "juliana@thechambergroup.com", "email2": "", "site": "thechambergroup.com", "note": "Toni Braxton"}, {"id": 112, "org": "PCPR", "name": "Phyllis Caddell", "email": "pcpr@pcpr.co", "email2": "", "site": "pcpr.co", "note": "All-Star Gospel Celebration – media"}, {"id": 113, "org": "iSquared PR", "name": "Rochelle", "email": "info@iSquaredPR.com", "email2": "", "site": "isquaredpr.com", "note": "Celebrity Charity Poker Night – Feb 12"}, {"id": 114, "org": "LEDE Company", "name": "Andrea Ng", "email": "andrea.ng@ledecompany.com", "email2": "", "site": "ledecompany.com", "note": "UnitedMasters GRAMMY party"}, {"id": 115, "org": "UMe / Universal Music", "name": "Meg McLean Corso", "email": "meg.mcleancorso@umusic.com", "email2": "", "site": "umusic.com", "note": "Pretty in Pink 40th Anniversary reissue"}, {"id": 116, "org": "BBR Music Group / BMG Nashville", "name": "Mark Logsdon", "email": "mark@bbrmusicgroup.com", "email2": "", "site": "bbrmusicgroup.com", "note": "Atlus – Art of Letting Go, March 20"}, {"id": 117, "org": "BBR Music Group / BMG Nashville", "name": "Brent Burns", "email": "brent@bbrmusicgroup.com", "email2": "", "site": "bbrmusicgroup.com", "note": "Atlus – Art of Letting Go"}, {"id": 118, "org": "Jay Jones Music", "name": "Jay Jones", "email": "jay@jayjonesmusic.com", "email2": "", "site": "jayjonesmusic.com", "note": "Atlus (artist rep)"}, {"id": 119, "org": "Elton John AIDS Foundation", "name": "AAVP Desk", "email": "AAVP@eltonjohnaidsfoundation.org", "email2": "", "site": "eltonjohnaidsfoundation.org", "note": "Oscar Viewing Party – March 15"}, {"id": 120, "org": "Elton John AIDS Foundation", "name": "Mary Pavlu", "email": "mary.pavlu@eltonjohnaidsfoundation.org", "email2": "", "site": "eltonjohnaidsfoundation.org", "note": "Oscar Viewing Party"}, {"id": 121, "org": "SAG Awards", "name": "Nic Vivas", "email": "nvivas@sagawards.org", "email2": "", "site": "sagawards.org", "note": "32nd SAG Awards – March 1 on Netflix"}, {"id": 122, "org": "DGA", "name": "Press Desk", "email": "MSchwenz@dga.org", "email2": "", "site": "dga.org", "note": "78th DGA Awards – Feb 7"}, {"id": 123, "org": "ASC", "name": "Patty Armacost", "email": "patty@theasc.com", "email2": "", "site": "theasc.com", "note": "40th ASC Awards – March 8"}, {"id": 124, "org": "PAFF", "name": "Press Room", "email": "press@paff.org", "email2": "", "site": "paff.org", "note": "34th Pan African Film & Arts Festival – Feb 9-16"}, {"id": 125, "org": "Universal Studios Hollywood", "name": "Publicity", "email": "USH.Publicity@udx.com", "email2": "", "site": "udx.com", "note": "Universal Fan Fest Nights – Apr 23-May 16"}, {"id": 126, "org": "Kino Lorber", "name": "Kate Patterson", "email": "kpatterson@kinolorber.com", "email2": "", "site": "kinolorber.com", "note": "Mr. Nobody Against Putin"}, {"id": 127, "org": "Sony Pictures Classics", "name": "Press Desk", "email": "press@spe.sony.com", "email2": "", "site": "spe.sony.com", "note": "Blue Moon"}, {"id": 128, "org": "Vesper PR", "name": "Mariluz Gonzalez", "email": "mgonzalez@vesperpublicrelations.com", "email2": "", "site": "vesperpublicrelations.com", "note": "Kings Del Wepa – Feb 12 Regent Theater"}, {"id": 129, "org": "WGA Foundation", "name": "Events", "email": "events@wgfoundation.org", "email2": "", "site": "wgfoundation.org", "note": "Beyond Words 2026 – Feb 12"}, {"id": 130, "org": "LAFCA / MPRM", "name": "Press", "email": "lafca@mprm.com", "email2": "", "site": "mprm.com", "note": "LAFCA At The Egyptian – Sex, Lies, and Videotape"}, {"id": 131, "org": "Cinetic Media", "name": "Just An Accident Desk", "email": "justanaccident@cineticmedia.com", "email2": "", "site": "cineticmedia.com", "note": "It Was Just An Accident [NEON]"}, {"id": 132, "org": "TopOfTheLine PR", "name": "Media/Talent", "email": "TopOfTheLineprla@gmail.com", "email2": "", "site": "gmail.com", "note": "Deep Frame premiere – Feb 10, Culver Theatre"}, {"id": 133, "org": "Vibrato Grill Jazz", "name": "Admin", "email": "admin@vibratogrilljazz.com", "email2": "", "site": "vibratogrilljazz.com", "note": "Herb Alpert's venue – Bel Air"}, {"id": 134, "org": "Laugh Factory", "name": "Info", "email": "info@laughfactory.com", "email2": "", "site": "laughfactory.com", "note": "Feb 11 – Jason Stuart & Friends"}, {"id": 135, "org": "Medium Rare", "name": "Info", "email": "info@medium-rare.com", "email2": "", "site": "medium-rare.com", "note": "Sports Illustrated Golf Invitational"}, {"id": 136, "org": "Sport Beach", "name": "RSVP", "email": "hello@sportbeach.com", "email2": "", "site": "sportbeach.com", "note": "Sport Beach Club House Pop-Up – Metreon, SF"}, {"id": 137, "org": "Fleishman Hillard", "name": "BAHC Desk", "email": "fh.bahc@fleishman.com", "email2": "", "site": "fleishman.com", "note": "BAHC Kickoff Party – Dolby SF"}, {"id": 138, "org": "Sharp Associates PR", "name": "Info", "email": "info@sharpassociatespr.com", "email2": "", "site": "sharpassociatespr.com", "note": "Artur Zakiyan piano concert – Feb 1"}, {"id": 139, "org": "BET", "name": "Mercedes Smith", "email": "mercedes.smith@bet.net", "email2": "", "site": "bet.net", "note": "NAACP Image Awards"}, {"id": 140, "org": "BET", "name": "Erica Knox", "email": "Erica.Knox@bet.net", "email2": "", "site": "bet.net", "note": "NAACP Image Awards"}, {"id": 141, "org": "BET", "name": "Autumn Griffith", "email": "Autumn.Griffin@bet.net", "email2": "", "site": "bet.net", "note": "NAACP Image Awards"}, {"id": 142, "org": "NAACP Hollywood Bureau", "name": "Ariana Drummond", "email": "imagepublicist@naacpnet.org", "email2": "", "site": "naacpnet.org", "note": "NAACP Image Awards publicist"}, {"id": 143, "org": "Variety", "name": "Jordan Moreau", "email": "jmoreau@variety.com", "email2": "", "site": "variety.com", "note": "Online news editor – breaking news, film & TV. Runs internship program (NY + LA). Based in NYC."}, {"id": 144, "org": "Variety", "name": "Haley Kluge", "email": "Hkluge@variety.com", "email2": "", "site": "variety.com", "note": "Creative Director. Formerly Netflix Tudum design team."}, {"id": 145, "org": "Victoria Beckham", "name": "Press / General Inbox", "email": "clientservices@victoriabeckham.com", "email2": "", "site": "victoriabeckham.com", "note": ""}, {"id": 146, "org": "Victoria Beckham", "name": "Press / General Inbox", "email": "support@victoriabeckhambeauty.com", "email2": "", "site": "victoriabeckhambeauty.com", "note": ""}, {"id": 147, "org": "Victoria Beckham", "name": "Lauren Archer", "email": "lauren.archer@victoriabeckham.com", "email2": "", "site": "victoriabeckham.com", "note": ""}, {"id": 148, "org": "Victoria Beckham", "name": "Jasmine Sevan", "email": "jasmine.sevan@victoriabeckham.com", "email2": "", "site": "victoriabeckham.com", "note": ""}, {"id": 149, "org": "Victoria Beckham", "name": "Global PR Coordinator (Beauty) Lucy Ewbank", "email": "lucy.ewbank@victoriabeckham.com", "email2": "", "site": "victoriabeckham.com", "note": ""}, {"id": 150, "org": "Victoria Beckham", "name": "Director, Global PR and Comm (Beauty) Julie Kirwan", "email": "julie.kirwan.ext@victoriabeckham.com", "email2": "", "site": "victoriabeckham.com", "note": ""}, {"id": 151, "org": "Burberry", "name": "Press / General Inbox", "email": "press.office@burberry.com", "email2": "", "site": "burberry.com", "note": ""}, {"id": 152, "org": "Burberry", "name": "Stephanie Mackie", "email": "stephanie.mackie@burberry.com", "email2": "", "site": "burberry.com", "note": ""}, {"id": 153, "org": "Burberry", "name": "Press Contact", "email": "gemma.parsons@burberry.com", "email2": "", "site": "burberry.com", "note": ""}, {"id": 154, "org": "Miu Miu", "name": "Press / General Inbox", "email": "pressoffice@miumiu.com", "email2": "", "site": "miumiu.com", "note": ""}, {"id": 155, "org": "Miu Miu", "name": "Press Contact", "email": "martina.forte@prada.com", "email2": "", "site": "prada.com", "note": ""}, {"id": 156, "org": "Miu Miu", "name": "Press Contact", "email": "owen.parry@prada.com", "email2": "", "site": "prada.com", "note": ""}, {"id": 157, "org": "JW Anderson", "name": "Press / General Inbox", "email": "press@jwanderson.com", "email2": "oceane.curey@jwanderson.com", "site": "jwanderson.com", "note": ""}, {"id": 158, "org": "JW Anderson", "name": "Press Contact", "email": "oceane.curey@jwanderson.com", "email2": "press@jwanderson.com", "site": "jwanderson.com", "note": ""}, {"id": 159, "org": "Simone Rocha", "name": "Press Contact", "email": "marion@dh-pr.com", "email2": "", "site": "dh-pr.com", "note": ""}, {"id": 160, "org": "Roksanda", "name": "Honor Gell", "email": "honor@roksanda.com", "email2": "", "site": "roksanda.com", "note": ""}, {"id": 161, "org": "Erdem", "name": "Press / General Inbox", "email": "press@erdem.com", "email2": "nadia.bean@erdem.com", "site": "erdem.com", "note": ""}, {"id": 162, "org": "Erdem", "name": "Nadia Bean", "email": "nadia.bean@erdem.com", "email2": "press@erdem.com", "site": "erdem.com", "note": ""}, {"id": 163, "org": "Erdem", "name": "Press Contact", "email": "emily.witley@erdem.com", "email2": "press@erdem.com", "site": "erdem.com", "note": ""}, {"id": 164, "org": "Phoebe English", "name": "Press Contact", "email": "phoebe@phoebeenglish.com", "email2": "", "site": "phoebeenglish.com", "note": ""}, {"id": 165, "org": "Sharon Wauchob", "name": "Press Contact", "email": "sharon@sharonwauchob.uk", "email2": "", "site": "sharonwauchob.uk", "note": ""}, {"id": 166, "org": "Sharon Wauchob", "name": "Press Contact", "email": "joshua@sharonwauchob.uk", "email2": "", "site": "sharonwauchob.uk", "note": ""}, {"id": 167, "org": "Kim Jones", "name": "Press / General Inbox", "email": "press@dior.com", "email2": "", "site": "dior.com", "note": ""}, {"id": 168, "org": "Kim Jones", "name": "Jed Partridge", "email": "jed@kimjonesstudio.com", "email2": "", "site": "kimjonesstudio.com", "note": ""}, {"id": 169, "org": "Kim Jones", "name": "Conor McCOry", "email": "conor@kimjonesstudio.com", "email2": "", "site": "kimjonesstudio.com", "note": ""}, {"id": 170, "org": "Kim Jones", "name": "Press Contact", "email": "lucy@kimjonesstudio.com", "email2": "", "site": "kimjonesstudio.com", "note": ""}, {"id": 171, "org": "Mary Katrantzou", "name": "Anastasia Antoniadou", "email": "anastasia.antoniadou@marykatrantzou.com", "email2": "", "site": "marykatrantzou.com", "note": ""}, {"id": 172, "org": "Bronx and Banco", "name": "Lucia Tyden", "email": "lucia@bronxandbanco.com", "email2": "", "site": "bronxandbanco.com", "note": ""}, {"id": 173, "org": "Bronx and Banco", "name": "Felicia Geller", "email": "felicia@bronxandbanco.com", "email2": "", "site": "bronxandbanco.com", "note": ""}, {"id": 174, "org": "Bronx and Banco", "name": "Banco", "email": "natalie@bronxandbanco.com", "email2": "", "site": "bronxandbanco.com", "note": ""}, {"id": 175, "org": "Bronx and Banco", "name": "Press Contact", "email": "peri@bronxandbanco.com", "email2": "", "site": "bronxandbanco.com", "note": ""}, {"id": 176, "org": "Bronx and Banco", "name": "Press Contact", "email": "jasmine@bronxandbanco.com", "email2": "", "site": "bronxandbanco.com", "note": ""}, {"id": 177, "org": "Bottega Veneta", "name": "Press / General Inbox", "email": "press@bottegaveneta.com", "email2": "aiko.inoue@bottegaveneta.com", "site": "bottegaveneta.com", "note": ""}, {"id": 178, "org": "Bottega Veneta", "name": "Aiko INoue", "email": "aiko.inoue@bottegaveneta.com", "email2": "press@bottegaveneta.com", "site": "bottegaveneta.com", "note": ""}, {"id": 179, "org": "Bottega Veneta", "name": "Maria SIlva", "email": "silva.maria@bottegaveneta.com", "email2": "press@bottegaveneta.com", "site": "bottegaveneta.com", "note": ""}, {"id": 180, "org": "The Row", "name": "Mai Sawai", "email": "mai.sawaai@therow.com", "email2": "", "site": "therow.com", "note": ""}, {"id": 181, "org": "The Row", "name": "Victoria Sutrisno", "email": "victoria.sutrisno@therow.com", "email2": "", "site": "therow.com", "note": ""}, {"id": 182, "org": "Virgil Abloh", "name": "Press / General Inbox", "email": "press@louisvuitton.com", "email2": "", "site": "louisvuitton.com", "note": ""}, {"id": 183, "org": "Virgil Abloh", "name": "Alexandre Demri", "email": "alexandre.demri@louisvuitton.com", "email2": "", "site": "louisvuitton.com", "note": ""}, {"id": 184, "org": "Virgil Abloh", "name": "Press Contact", "email": "eleonora.silvestri@off---white.com", "email2": "", "site": "off-white.com", "note": ""}, {"id": 185, "org": "Virgil Abloh", "name": "white.com", "email": "offwhite@karlaotto.com", "email2": "", "site": "karlaotto.com", "note": ""}, {"id": 186, "org": "Virgil Abloh", "name": "Press Contact", "email": "simon.lee@off---white.com", "email2": "", "site": "off-white.com", "note": ""}, {"id": 187, "org": "Alessandro Michele", "name": "Press / General Inbox", "email": "press@gucci.com", "email2": "mara.convertini@gucci.com", "site": "gucci.com", "note": ""}, {"id": 188, "org": "Alessandro Michele", "name": "Mara Convertini", "email": "mara.convertini@gucci.com", "email2": "press@gucci.com", "site": "gucci.com", "note": ""}, {"id": 189, "org": "Alessandro Michele", "name": "Press Contact", "email": "sarah.dhaoui@gucci.com", "email2": "press@gucci.com", "site": "gucci.com", "note": ""}, {"id": 190, "org": "Balenciaga", "name": "Press / General Inbox", "email": "press@balenciaga.com", "email2": "gianfranco.gianangeli@balenciaga.com", "site": "balenciaga.com", "note": ""}, {"id": 191, "org": "Balenciaga", "name": "Press Contact", "email": "gianfranco.gianangeli@balenciaga.com", "email2": "press@balenciaga.com", "site": "balenciaga.com", "note": ""}, {"id": 192, "org": "Saint Laurent", "name": "Press / General Inbox", "email": "press@ysl.com", "email2": "kevin.legoux@ysl.com", "site": "ysl.com", "note": ""}, {"id": 193, "org": "Saint Laurent", "name": "Press Contact", "email": "kevin.legoux@ysl.com", "email2": "press@ysl.com", "site": "ysl.com", "note": ""}, {"id": 194, "org": "Saint Laurent", "name": "Press Contact", "email": "anicka.wintle@ysl.com", "email2": "press@ysl.com", "site": "ysl.com", "note": ""}, {"id": 195, "org": "Saint Laurent", "name": "Press Contact", "email": "sarah.coffey@ysl.com", "email2": "press@ysl.com", "site": "ysl.com", "note": ""}, {"id": 196, "org": "Saint Laurent", "name": "Press Contact", "email": "soomin.cho@ysl.com", "email2": "press@ysl.com", "site": "ysl.com", "note": ""}, {"id": 197, "org": "Maison Margiela", "name": "Press / General Inbox", "email": "presse@margiela.com", "email2": "", "site": "margiela.com", "note": ""}, {"id": 198, "org": "Maison Margiela", "name": "Press & Celebrities", "email": "emma_sidibe@margiela.com", "email2": "", "site": "margiela.com", "note": ""}, {"id": 199, "org": "Maison Margiela", "name": "Press Contact", "email": "clemence_duquenne@margiela.com", "email2": "", "site": "margiela.com", "note": ""}, {"id": 200, "org": "Maison Margiela", "name": "Press Contact", "email": "elise_weber@margiela.com", "email2": "", "site": "margiela.com", "note": ""}, {"id": 201, "org": "Prada", "name": "Press Contact", "email": "evgeniya.melnikova@prada.com", "email2": "", "site": "prada.com", "note": ""}, {"id": 202, "org": "Prada", "name": "Press Contact", "email": "oceanne.bessou@prada.com", "email2": "", "site": "prada.com", "note": ""}, {"id": 203, "org": "Prada", "name": "Press Contact", "email": "madeline.grebil@prada.com", "email2": "", "site": "prada.com", "note": ""}, {"id": 204, "org": "Alexander McQueen", "name": "Press / General Inbox", "email": "camilla.cioffredi@alexandermcqueen.com", "email2": "", "site": "alexandermcqueen.com", "note": ""}, {"id": 205, "org": "Alexander McQueen", "name": "PR and Marketing", "email": "Manager-olivia.jiang@alexandermcqueen.com", "email2": "", "site": "alexandermcqueen.com", "note": ""}, {"id": 206, "org": "Stella McCartney", "name": "Press / General Inbox", "email": "giorgia.massaccesi@stellamccartney.com", "email2": "", "site": "stellamccartney.com", "note": ""}, {"id": 207, "org": "Stella McCartney", "name": "Press / General Inbox", "email": "arabella.rufino@stellamccartney.com", "email2": "", "site": "stellamccartney.com", "note": ""}, {"id": 208, "org": "Stella McCartney", "name": "Press Contact", "email": "virginia.nanni@stellamccartney.com", "email2": "", "site": "stellamccartney.com", "note": ""}, {"id": 209, "org": "Ferragamo", "name": "Press / General Inbox", "email": "alessia.arosio@ferragamo.com", "email2": "", "site": "ferragamo.com", "note": ""}, {"id": 210, "org": "Ferragamo", "name": "Press Contact", "email": "marta.riccobono@ferragamo.com", "email2": "", "site": "ferragamo.com", "note": ""}, {"id": 211, "org": "Ferragamo", "name": "Press Contact", "email": "klara.bredlow@ferragamo.com", "email2": "", "site": "ferragamo.com", "note": ""}, {"id": 212, "org": "16Arlington", "name": "Press / General Inbox", "email": "craig@16arlington.co.uk", "email2": "", "site": "16arlington.co.uk", "note": ""}, {"id": 213, "org": "16Arlington", "name": "Press Contact", "email": "bliss@16arlington.co.uk", "email2": "", "site": "16arlington.co.uk", "note": ""}, {"id": 214, "org": "16Arlington", "name": "Press Contact", "email": "isee@16arlington.co.uk", "email2": "", "site": "16arlington.co.uk", "note": ""}, {"id": 215, "org": "Nensi Dojaka", "name": "Press / General Inbox", "email": "studio@nensidojaka.co.uk", "email2": "", "site": "nensidojaka.co.uk", "note": ""}, {"id": 216, "org": "Richard Quinn", "name": "Press / General Inbox", "email": "press@richardquinn.com", "email2": "", "site": "richardquinn.com", "note": ""}, {"id": 217, "org": "Richard Quinn", "name": "Press Contact", "email": "info@richardquinnstudio.co.uk", "email2": "", "site": "richardquinnstudio.co.uk", "note": ""}, {"id": 218, "org": "Ashish", "name": "Press / General Inbox", "email": "studio@ashish.co.uk", "email2": "", "site": "ashish.co.uk", "note": ""}, {"id": 219, "org": "Conner Ives", "name": "Press / General Inbox", "email": "studio@connerives.com", "email2": "", "site": "connerives.com", "note": ""}, {"id": 220, "org": "Conner Ives", "name": "Press / General Inbox", "email": "connerives@dlx.co", "email2": "", "site": "dlx.co", "note": ""}, {"id": 221, "org": "Conner Ives", "name": "Press Contact", "email": "sara@belier.info", "email2": "", "site": "belier.info", "note": ""}, {"id": 222, "org": "Dilara Fındıkoğlu", "name": "Press / General Inbox", "email": "studio@dilarafindikoglu.com", "email2": "", "site": "dilarafindikoglu.com", "note": ""}, {"id": 223, "org": "Dilara Fındıkoğlu", "name": "Press Contact", "email": "deniz@dilarafindikoglu.com", "email2": "", "site": "dilarafindikoglu.com", "note": ""}, {"id": 224, "org": "Huishan Zhang", "name": "Press / General Inbox", "email": "viet-anh@huishanzhang.com", "email2": "", "site": "huishanzhang.com", "note": ""}, {"id": 225, "org": "Chet Lo", "name": "Press / General Inbox", "email": "chet@chetlo.com", "email2": "", "site": "chetlo.com", "note": ""}, {"id": 226, "org": "British Fashion Council", "name": "Press / General Inbox", "email": "eve.cousins@britishfashioncouncil.com", "email2": "", "site": "britishfashioncouncil.com", "note": ""}, {"id": 227, "org": "British Fashion Council", "name": "Press Contact", "email": "tanya.spero@britishfashioncouncil.com", "email2": "", "site": "britishfashioncouncil.com", "note": ""}, {"id": 228, "org": "KCD Worldwide", "name": "Press / General Inbox", "email": "info@kcdworldwide.com", "email2": "annasuishow@kcdworldwide.com", "site": "kcdworldwide.com", "note": ""}, {"id": 229, "org": "Caroline Mower PR", "name": "Press / General Inbox", "email": "info@carolinemowerpr.com", "email2": "", "site": "carolinemowerpr.com", "note": ""}, {"id": 230, "org": "Purple PR", "name": "Press / General Inbox", "email": "info@purplepr.com", "email2": "carolyn.batista@purplepr.com", "site": "purplepr.com", "note": ""}, {"id": 231, "org": "Hannah Sharman-Cox PR", "name": "Press / General Inbox", "email": "info@hannahsharmancox.com", "email2": "", "site": "hannahsharmancox.com", "note": ""}, {"id": 232, "org": "The Communications Store", "name": "Press / General Inbox", "email": "info@thecommunicationsstore.com", "email2": "", "site": "thecommunicationsstore.com", "note": ""}, {"id": 233, "org": "Borough PR", "name": "Press / General Inbox", "email": "info@boroughpr.com", "email2": "", "site": "boroughpr.com", "note": ""}, {"id": 234, "org": "M&C Saatchi PR", "name": "Press / General Inbox", "email": "info@mcsaatchi.com", "email2": "", "site": "mcsaatchi.com", "note": ""}, {"id": 235, "org": "Iris PR", "name": "Press / General Inbox", "email": "info@irispr.com", "email2": "", "site": "irispr.com", "note": ""}, {"id": 236, "org": "Frank PR", "name": "Press / General Inbox", "email": "info@frankpr.it", "email2": "", "site": "frankpr.it", "note": ""}, {"id": 237, "org": "BFA @bfa", "name": "Press / General Inbox", "email": "maryjoy@bfamedia.co", "email2": "", "site": "bfamedia.co", "note": ""}, {"id": 238, "org": "BFA @bfa", "name": "Press Contact", "email": "banjo@bfamedia.co", "email2": "", "site": "bfamedia.co", "note": ""}, {"id": 239, "org": "CFDA", "name": "Press / General Inbox", "email": "communications@cfda.com", "email2": "", "site": "cfda.com", "note": ""}, {"id": 240, "org": "CFDA", "name": "Press / General Inbox", "email": "awards@cfda.com", "email2": "", "site": "cfda.com", "note": ""}, {"id": 241, "org": "CFDA", "name": "Senior Marketing & Communications Manager;", "email": "a.araujo@cfda.com", "email2": "", "site": "cfda.com", "note": ""}, {"id": 242, "org": "CFDA", "name": "Director of Special Projects + Events", "email": "l.king@cfda.com", "email2": "", "site": "cfda.com", "note": ""}, {"id": 243, "org": "CFDA", "name": "Press Contact", "email": "p.viteri@cfda.com", "email2": "", "site": "cfda.com", "note": ""}, {"id": 244, "org": "CFDA", "name": "Press Contact", "email": "m.karimzadeh@cfda.com", "email2": "", "site": "cfda.com", "note": ""}, {"id": 245, "org": "CFDA", "name": "Press Contact", "email": "i.mayes@cfda.com", "email2": "", "site": "cfda.com", "note": ""}, {"id": 246, "org": "Baby2Baby", "name": "Press Contact", "email": "haewan@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 247, "org": "", "name": "Press Contact", "email": "jennifer.moreno@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 248, "org": "", "name": "Press Contact", "email": "briney@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 249, "org": "", "name": "Press Contact", "email": "shea@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 250, "org": "", "name": "Press Contact", "email": "melissa@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 251, "org": "", "name": "Press Contact", "email": "kelly@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 252, "org": "", "name": "Press Contact", "email": "norah@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 253, "org": "", "name": "Press Contact", "email": "donate@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 254, "org": "", "name": "Press Contact", "email": "brittany@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 255, "org": "Vogue (US / UK / Arabia / Vogue Runway)", "name": "Jorden Bickham", "email": "jorden_bickham@condenast.com", "email2": "", "site": "condenast.com", "note": "Fashion | High-End / Prestige | Priority: High | Patrick is a contributing photographer to British and Australian Vogue living in Connecticut. Alexandra was just promoted from her role as a market editor. Jorden is based in the NY office. | Status: emailed except patrick"}, {"id": 256, "org": "Vogue (US / UK / Arabia / Vogue Runway)", "name": "Alexandra Michler", "email": "alexandra_michler@vogue.com", "email2": "", "site": "vogue.com", "note": "Fashion | High-End / Prestige | Priority: High | Patrick is a contributing photographer to British and Australian Vogue living in Connecticut. Alexandra was just promoted from her role as a market editor. Jorden is based in the NY office. | Status: emailed except patrick"}, {"id": 257, "org": "Harper’s Bazaar (US / UK / Arabia)", "name": "Ariana Marsh", "email": "ariana.marsh@hearst.com", "email2": "", "site": "hearst.com", "note": "Fashion | High-End / Prestige | Priority: High | Andrea overseas all things celebrity and tv. Ariana have covered Kali Uchis and Giveon recently. Amy seems easy to contact, UK based. | Status: emailed all"}, {"id": 258, "org": "Harper’s Bazaar (US / UK / Arabia)", "name": "Andrea Cuttler", "email": "andrea.cuttler@hearst.com", "email2": "", "site": "hearst.com", "note": "Fashion | High-End / Prestige | Priority: High | Andrea overseas all things celebrity and tv. Ariana have covered Kali Uchis and Giveon recently. Amy seems easy to contact, UK based. | Status: emailed all"}, {"id": 259, "org": "Harper’s Bazaar (US / UK / Arabia)", "name": "Amy Klerk", "email": "amy.deklerk@hearst.co.uk", "email2": "", "site": "hearst.co.uk", "note": "Fashion | High-End / Prestige | Priority: High | Andrea overseas all things celebrity and tv. Ariana have covered Kali Uchis and Giveon recently. Amy seems easy to contact, UK based. | Status: emailed all"}, {"id": 260, "org": "NY Mag", "name": "Asia Milia", "email": "asia.ware@voxmedia.com", "email2": "", "site": "voxmedia.com", "note": "Fashion | Mid-Tier / Accessible | Priority: Medium | Status: Emailed"}, {"id": 261, "org": "Revolt", "name": "Oumou Fofana", "email": "ofofana@ladmm.tv", "email2": "", "site": "ladmm.tv", "note": "Fashion | Fashion/Pop Culture | Priority: Prestige | Status: Emailed"}, {"id": 262, "org": "SS Activewear", "name": "American Apparel With Love Cocktail — RSVP", "email": "dfreet@ssactivewear.com", "email2": "", "site": "ssactivewear.com", "note": "NYFW SS25 | Aug 29 | American Apparel With Love Cocktail | RSVP"}, {"id": 263, "org": "Harper's Bazaar", "name": "Harper's Bazaar Icons Issue — RSVP", "email": "events@harpersbazaar.com", "email2": "", "site": "harpersbazaar.com", "note": "NYFW SS25 | Sep 4 | Harper's Bazaar Icons Issue NYFW Kickoff | RSVP"}, {"id": 264, "org": "Randi Rahm", "name": "Randi Rahm", "email": "randirahm2@gmail.com", "email2": "", "site": "gmail.com", "note": "NYFW SS25 | Sep 4 | Randi Rahm S/S25 Fashion Presentation | RSVP"}, {"id": 265, "org": "RHC (Riff Raff Club)", "name": "Riff Raff Club Opening Party — RSVP", "email": "riffraffclubrsvp@wearerhc.com", "email2": "", "site": "wearerhc.com", "note": "NYFW SS25 | Sep 4 | Riff Raff Club Opening Party | RSVP"}, {"id": 266, "org": "Daily Front Row", "name": "Daily Front Row — RSVP", "email": "rsvp@dailyfrontrow.com", "email2": "eddie@dailyfrontrow.com", "site": "dailyfrontrow.com", "note": "NYFW SS25 | Sep 4 | Daily Front Row NYFW Kickoff with Ana Sky | RSVP"}, {"id": 267, "org": "KCD Worldwide", "name": "Veronica Beard Cocktail Party — Requests", "email": "veronicabeard@kcdworldwide.co.uk", "email2": "noel.garcia@veronicabeard.com", "site": "kcdworldwide.co.uk", "note": "NYFW SS25 | Sep 5 | Veronica Beard Cocktail Party | Requests"}, {"id": 268, "org": "Veronica Beard", "name": "Noel Garcia", "email": "noel.garcia@veronicabeard.com", "email2": "veronicabeard@kcdworldwide.co.uk", "site": "veronicabeard.com", "note": "NYFW SS25 | Sep 5 | Veronica Beard Cocktail Party | Requests"}, {"id": 269, "org": "Billboard", "name": "Billboard Impact Dinner / R&B Hip-Hop Power Players — RSVP", "email": "rsvp@billboard.com", "email2": "", "site": "billboard.com", "note": "NYFW SS25 | Sep 5 | Billboard Impact Dinner / R&B Hip-Hop Power Players | RSVP"}, {"id": 270, "org": "Paul Wilmot Communications", "name": "Supima Design Competition — RSVP", "email": "supima@paulwilmot.com", "email2": "", "site": "paulwilmot.com", "note": "NYFW SS25 | Sep 5 | Supima Design Competition | RSVP"}, {"id": 271, "org": "Ralph Lauren", "name": "Lauren Astry", "email": "lauren.astry@ralphlauren.com", "email2": "", "site": "ralphlauren.com", "note": "NYFW SS25 | Sep 5 | Ralph Lauren Runway Show | Requests"}, {"id": 272, "org": "Maui x Lolita", "name": "Maui x Lolita — RSVP", "email": "pr@mauixlolita.com", "email2": "", "site": "mauixlolita.com", "note": "NYFW SS25 | Sep 6 | Maui x Lolita SS25 Show | RSVP"}, {"id": 273, "org": "The Lounge", "name": "The Lounge — Contact", "email": "lastinglegacypr@gmail.com", "email2": "", "site": "gmail.com", "note": "NYFW SS25 | Sep 6 | The Lounge NYFW Kickoff Party | Contact"}, {"id": 274, "org": "Daily Front Row", "name": "Daily Front Row Party — Contact", "email": "eddie@dailyfrontrow.com", "email2": "rsvp@dailyfrontrow.com", "site": "dailyfrontrow.com", "note": "NYFW SS25 | Sep 6 | Daily Front Row Party | Contact"}, {"id": 275, "org": "CLD PR / Style House", "name": "CLD PR Kickoff Event — Requests", "email": "michelle@cldstylehouse.com", "email2": "", "site": "cldstylehouse.com", "note": "NYFW SS25 | Sep 6 | CLD PR Kickoff Event | Requests"}, {"id": 276, "org": "Tenique Bernard", "name": "Brandon Maxwell — Contact", "email": "tenique@teniquebernard.com", "email2": "", "site": "teniquebernard.com", "note": "NYFW SS25 | Sep 6 | Brandon Maxwell s/s25 Runway | Contact"}, {"id": 277, "org": "The Residency Experience", "name": "Libertine — Contact", "email": "stephen@theresidencyexperience.com", "email2": "", "site": "theresidencyexperience.com", "note": "NYFW SS25 | Sep 6 | Libertine s/s25 Runway | Contact"}, {"id": 278, "org": "Purple PR", "name": "Badgley Mischka Spring 2025 — RSVP", "email": "badgleymischka@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 6 | Badgley Mischka Spring 2025 Presentation | RSVP"}, {"id": 279, "org": "CLD PR / Style House", "name": "CLD PR — RSVP", "email": "sammy@cldstylehouse.com", "email2": "", "site": "cldstylehouse.com", "note": "NYFW SS25 | Sep 6 | CLD PR NYFW Kickoff Event | RSVP"}, {"id": 280, "org": "John Varvatos", "name": "John Varvatos Kiln & Craft — RSVP", "email": "jamesschuck@johnnvarvatos.com", "email2": "", "site": "johnvarvatos.com", "note": "NYFW SS25 | Sep 6 | John Varvatos Kiln & Craft Presentation | RSVP"}, {"id": 281, "org": "CCPR NYC", "name": "Chris Constable", "email": "rynshu@ccpr-nyc.com", "email2": "", "site": "ccpr-nyc.com", "note": "NYFW SS25 | Sep 6 | Rynshu SS25 Collection | Contact"}, {"id": 282, "org": "Daily Front Row", "name": "Fashion Media Awards — RSVP", "email": "fma@dailyfrontrow.com", "email2": "jocelyn.cash@purplepr.com", "site": "dailyfrontrow.com", "note": "NYFW SS25 | Sep 6 | Fashion Media Awards | RSVP"}, {"id": 283, "org": "Purple PR", "name": "Jocelyn Cash", "email": "jocelyn.cash@purplepr.com", "email2": "info@purplepr.com", "site": "purplepr.com", "note": "NYFW SS25 | Sep 6 | Fashion Media Awards | Contact"}, {"id": 284, "org": "KCD Worldwide", "name": "Tommy Hilfiger Spring 2025 — Contact", "email": "oneill@kcdworldwide.co.uk", "email2": "", "site": "kcdworldwide.co.uk", "note": "NYFW SS25 | Sep 8 | Tommy Hilfiger Spring 2025 Runway | Contact"}, {"id": 285, "org": "The Hinton Group", "name": "Sergio Hudson — Contact", "email": "omari@thehintongroup.co", "email2": "claudiali@thehintongroup.co", "site": "thehintongroup.co", "note": "NYFW SS25 | Sep 7 | Sergio Hudson s/s25 Runway | Contact"}, {"id": 286, "org": "Gia Kuan Consulting", "name": "Kim Shui — Contact", "email": "kimshui@giakuan.com", "email2": "cynthiarowley@giakuan.com", "site": "giakuan.com", "note": "NYFW SS25 | Sep 7 | Kim Shui s/s25 Runway | Contact"}, {"id": 287, "org": "alice + olivia", "name": "Lauren Bochner", "email": "lauren.bochner@aliceandolivia.com", "email2": "sydney@sydneyreising.com", "site": "aliceandolivia.com", "note": "NYFW SS25 | Sep 7 | alice + olivia s/s25 Runway | Contact"}, {"id": 288, "org": "Prabal Gurung", "name": "Prabal Gurung — Contact", "email": "marianna@prabalgurung.com", "email2": "", "site": "prabalgurung.com", "note": "NYFW SS25 | Sep 7 | Prabal Gurung s/s25 Runway | Contact"}, {"id": 289, "org": "Lucien Pagès PR", "name": "Off-White — Contact", "email": "nsimond@lucienpages.com", "email2": "", "site": "lucienpages.com", "note": "NYFW SS25 | Sep 8 | Off-White s/s25 Runway (Paris) | Contact"}, {"id": 290, "org": "Jason Wu", "name": "Jason Wu — Contact", "email": "gina@jasonwustudio.com", "email2": "", "site": "jasonwustudio.com", "note": "NYFW SS25 | Sep 8 | Jason Wu s/s25 Runway | Contact"}, {"id": 291, "org": "Ulla Johnson", "name": "Ulla Johnson — Contact", "email": "cori@ullajohnson.com", "email2": "", "site": "ullajohnson.com", "note": "NYFW SS25 | Sep 8 | Ulla Johnson s/s25 Runway | Contact"}, {"id": 292, "org": "Eckhaus Latta", "name": "ECKHAUS LATTA — Contact", "email": "press@eckhauslatta.com", "email2": "", "site": "eckhauslatta.com", "note": "NYFW SS25 | Sep 8 | ECKHAUS LATTA s/s25 Runway | Contact"}, {"id": 293, "org": "KPM Gregor", "name": "Bach Mai — Contact", "email": "patrick@kpmgregor.com", "email2": "", "site": "kpmgregor.com", "note": "NYFW SS25 | Sep 8 | Bach Mai s/s25 Runway | Contact"}, {"id": 294, "org": "3.1 Phillip Lim", "name": "3.1 Phillip Lim — Contact", "email": "rsikar@31philliplim.com", "email2": "", "site": "31philliplim.com", "note": "NYFW SS25 | Sep 8 | 3.1 Phillip Lim s/s25 Runway | Contact"}, {"id": 295, "org": "LaQuan Smith", "name": "LaQuan Smith — Inquiries", "email": "office@laquansmith.com", "email2": "", "site": "laquansmith.com", "note": "NYFW SS25 | Sep 9 | LaQuan Smith s/s25 Runway | Inquiries"}, {"id": 296, "org": "Coach", "name": "Coach — Contact", "email": "agarciasantana@coach.com", "email2": "bbelke@coach.com", "site": "coach.com", "note": "NYFW SS25 | Sep 9 | Coach s/s25 Runway | Contact"}, {"id": 297, "org": "Coach", "name": "Coach — Contact", "email": "bbelke@coach.com", "email2": "toconnell@coach.com", "site": "coach.com", "note": "NYFW SS25 | Sep 9 | Coach s/s25 Runway | Contact"}, {"id": 298, "org": "Coach", "name": "Coach — Contact", "email": "toconnell@coach.com", "email2": "agarciasantana@coach.com", "site": "coach.com", "note": "NYFW SS25 | Sep 9 | Coach s/s25 Runway | Contact"}, {"id": 299, "org": "Carolina Herrera", "name": "Jenna Cavanagh", "email": "jenna.cavanagh@cherrera.com", "email2": "", "site": "cherrera.com", "note": "NYFW SS25 | Sep 9 | Carolina Herrera s/s25 Runway | Contact"}, {"id": 300, "org": "Lafayette 148 New York", "name": "Rachel Kaplan", "email": "rachel.kaplan@lafayette148.com", "email2": "", "site": "lafayette148.com", "note": "NYFW SS25 | Sep 9 | Lafayette 148 New York s/s25 Runway | Contact"}, {"id": 301, "org": "KWT Global", "name": "Naeem Khan — Contact", "email": "bhospodor@kwtglobal.com", "email2": "", "site": "kwtglobal.com", "note": "NYFW SS25 | Sep 9 | Naeem Khan s/s25 Runway | Contact"}, {"id": 302, "org": "COS", "name": "Georgia Long", "email": "georgia.long@cosstores.com", "email2": "niklas.peter@cosstores.com", "site": "cosstores.com", "note": "NYFW SS25 | Sep 10 | COS s/s25 Runway | Contact"}, {"id": 303, "org": "COS", "name": "Niklas Peter", "email": "niklas.peter@cosstores.com", "email2": "georgia.long@cosstores.com", "site": "cosstores.com", "note": "NYFW SS25 | Sep 10 | COS s/s25 Runway | Contact"}, {"id": 304, "org": "Cynthia Rowley", "name": "Cynthia Rowley — Contact", "email": "prdept@cynthiarowley.com", "email2": "", "site": "cynthiarowley.com", "note": "NYFW SS25 | Sep 10 | Cynthia Rowley s/s25 Runway | Contact"}, {"id": 305, "org": "Totême", "name": "Totême — Contact", "email": "sabina@toteme-studio.com", "email2": "", "site": "toteme-studio.com", "note": "NYFW SS25 | Sep 10 | Totême s/s25 Runway | Contact"}, {"id": 306, "org": "Negri Firman PR", "name": "A Luna", "email": "a.luna@negrifirman.com", "email2": "chris@ccpr-nyc.com", "site": "negrifirman.com", "note": "NYFW SS25 | Sep 11 | Frederick Anderson s/s25 Runway | Contact"}, {"id": 307, "org": "CCPR NYC", "name": "Frederick Anderson — Contact", "email": "chris@ccpr-nyc.com", "email2": "a.luna@negrifirman.com", "site": "ccpr-nyc.com", "note": "NYFW SS25 | Sep 11 | Frederick Anderson s/s25 Runway | Contact"}, {"id": 308, "org": "Sebastien Ami", "name": "Sebastien Ami — Requests", "email": "pr@sebastienami.com", "email2": "", "site": "sebastienami.com", "note": "NYFW SS25 | Sep 11 | Sebastien Ami s/s25 Runway | Requests"}, {"id": 309, "org": "Monse", "name": "Monse — Requests", "email": "pr@monse.com", "email2": "", "site": "monse.com", "note": "NYFW SS25 | Sep 7 | Monse s/s25 Runway | Requests"}, {"id": 310, "org": "Purple PR", "name": "Grace Ling — RSVP", "email": "graceling@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 6 | Grace Ling SS25 Runway (Purple PR) | RSVP"}, {"id": 311, "org": "Purple PR", "name": "Willy Chavarria — RSVP", "email": "willychavarria@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 6 | Willy Chavarria SS25 Runway (Purple PR) | RSVP"}, {"id": 312, "org": "Purple PR", "name": "Campillo — RSVP", "email": "campillo@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 7 | Campillo SS25 Runway (Purple PR) | RSVP"}, {"id": 313, "org": "Purple PR", "name": "Palomo Spain — RSVP", "email": "palomospain@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 7 | Palomo Spain SS25 Runway (Purple PR) | RSVP"}, {"id": 314, "org": "Purple PR", "name": "Christian Cowan — RSVP", "email": "christiancowan@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 8 | Christian Cowan SS25 Runway (Purple PR) | RSVP"}, {"id": 315, "org": "Purple PR", "name": "The Blonds — RSVP", "email": "theblonds@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 8 | The Blonds SS25 Runway (Purple PR) | RSVP"}, {"id": 316, "org": "Purple PR", "name": "Naeem Khan — RSVP", "email": "naeemkhan@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 9 | Naeem Khan SS25 Runway (Purple PR) | RSVP"}, {"id": 317, "org": "Purple PR", "name": "Dennis Basso — RSVP", "email": "dennisbasso@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 9 | Dennis Basso SS25 Runway (Purple PR) | RSVP"}, {"id": 318, "org": "Purple PR", "name": "Juzui — RSVP", "email": "juzui@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 10 | Juzui SS25 Runway (Purple PR) | RSVP"}, {"id": 319, "org": "Purple PR", "name": "FIT MFA Design Graduate — RSVP", "email": "fitmfashow@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 10 | FIT MFA Design Graduate Runway (Purple PR) | RSVP"}, {"id": 320, "org": "Purple PR", "name": "Pamella Roland — RSVP", "email": "pamellaroland@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 10 | Pamella Roland SS25 Runway (Purple PR) | RSVP"}, {"id": 321, "org": "Adeam", "name": "Katrina Stephen", "email": "press@adeamonline.com", "email2": "", "site": "adeamonline.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 322, "org": "Agentry PR", "name": "Henry Kessler", "email": "aknvas@agentrypr.com", "email2": "cseries@agentrypr.com", "site": "agentrypr.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 323, "org": "Sydney Reising PR", "name": "Sydney Reising", "email": "sydney@sydneyreising.com", "email2": "taylor.arnold@aliceandolivia.com", "site": "sydneyreising.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 324, "org": "alice + olivia", "name": "Taylor Arnold", "email": "taylor.arnold@aliceandolivia.com", "email2": "lauren.bochner@aliceandolivia.com", "site": "aliceandolivia.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 325, "org": "Amen", "name": "Cristina Colli", "email": "amenpress@jato.it", "email2": "", "site": "jato.it", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 326, "org": "KCD Worldwide", "name": "Charlotte Buchanan", "email": "annasuishow@kcdworldwide.com", "email2": "info@kcdworldwide.com", "site": "kcdworldwide.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 327, "org": "Badgley Mischka", "name": "Rob Caldwell", "email": "rcaldwell@badgleymischka.com", "email2": "", "site": "badgleymischka.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 328, "org": "Mode World PR", "name": "Jameela Lake", "email": "jameela@modeworld.com", "email2": "", "site": "modeworld.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 329, "org": "Bibhu Mohapatra", "name": "Anne Fahey-Stormont", "email": "rsvp@bibhu.com", "email2": "", "site": "bibhu.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 330, "org": "Black in Fashion Council", "name": "Sandrine Charles", "email": "sandrine@blackinfashioncouncil.com", "email2": "", "site": "blackinfashioncouncil.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 331, "org": "Purple PR", "name": "Meline Agabaian", "email": "bronxandbanco@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 332, "org": "Agentry PR", "name": "Agentry PR Desk", "email": "cseries@agentrypr.com", "email2": "aknvas@agentrypr.com", "site": "agentrypr.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 333, "org": "Purple PR", "name": "Jocelyn Mak", "email": "chocheng@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 334, "org": "Christian Cowan", "name": "Natthias Mitchinson", "email": "natthias@christiancowan.com", "email2": "", "site": "christiancowan.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 335, "org": "Catinella PR", "name": "Robyn Catinella", "email": "press@catinella.com.au", "email2": "", "site": "catinella.com.au", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 336, "org": "Chromat", "name": "Chromat Press", "email": "info@chromat.co", "email2": "", "site": "chromat.co", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 337, "org": "Jay All LLC", "name": "Noreen Scott", "email": "nscott@jayallc.com", "email2": "", "site": "jayallc.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 338, "org": "The Hinton Group", "name": "Ashlyn Johnson", "email": "claudiali@thehintongroup.co", "email2": "sergio@thehintongroup.co", "site": "thehintongroup.co", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 339, "org": "Gia Kuan Consulting", "name": "Gia Kuan — Collina Strada", "email": "collinastrada@giakuan.com", "email2": "cynthiarowley@giakuan.com", "site": "giakuan.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 340, "org": "Purple PR", "name": "Concept Korea Desk", "email": "conceptkorea@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 341, "org": "NY China Fashion Collective", "name": "Claire Lin", "email": "info@nychinafashioncollective.com", "email2": "", "site": "nychinafashioncollective.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 342, "org": "Gia Kuan Consulting", "name": "Gia Kuan — Cynthia Rowley", "email": "cynthiarowley@giakuan.com", "email2": "collinastrada@giakuan.com", "site": "giakuan.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 343, "org": "Kim Shui", "name": "Kim Shui Press Team", "email": "hello@kimshui.net", "email2": "", "site": "kimshui.net", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 344, "org": "The Blonds", "name": "Brynne Formato", "email": "press@theblonds.nyc", "email2": "", "site": "theblonds.nyc", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 345, "org": "Pat Bo", "name": "Savannah Engel", "email": "claire@savannahengel.com", "email2": "", "site": "savannahengel.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 346, "org": "Area", "name": "Area PR Desk", "email": "requests@area.nyc", "email2": "maggie@area.nyc", "site": "area.nyc", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 347, "org": "Lucien Pagès PR", "name": "NYC Desk", "email": "nyc@lucienpages.com", "email2": "", "site": "lucienpages.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 348, "org": "Lindsey Media", "name": "Lindsey Solomon", "email": "lindsey@lindsey.media", "email2": "wiederhoeft@lindsey.media", "site": "lindsey.media", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 349, "org": "Thom Browne", "name": "Thom Browne Press", "email": "press@thombrowne.com", "email2": "", "site": "thombrowne.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 350, "org": "Marc Jacobs", "name": "Hilary McCanse", "email": "h.mccanse@marcjacobs.com", "email2": "", "site": "marcjacobs.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 351, "org": "Batsheva", "name": "Batsheva Press", "email": "info@batsheva.com", "email2": "", "site": "batsheva.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 352, "org": "Karla Otto PR", "name": "Elgene Castueras", "email": "elgene.castueras@karlaotto.com", "email2": "", "site": "karlaotto.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 353, "org": "Loft Creative Group", "name": "Gregory (Loft CG)", "email": "gregory@loftcreativegroup.com", "email2": "", "site": "loftcreativegroup.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 354, "org": "Michael Kors", "name": "Raya Goonetilleke", "email": "raya.goonetilleke@michaelkors.com", "email2": "edwin.zotamba@michaelkors.com", "site": "michaelkors.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 355, "org": "Michael Kors", "name": "Edwin Zotamba", "email": "edwin.zotamba@michaelkors.com", "email2": "allison.stein@michaelkors.com", "site": "michaelkors.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 356, "org": "Michael Kors", "name": "Allison Stein", "email": "allison.stein@michaelkors.com", "email2": "raya.goonetilleke@michaelkors.com", "site": "michaelkors.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 357, "org": "Purple PR", "name": "Carolyn Batista", "email": "carolyn.batista@purplepr.com", "email2": "info@purplepr.com", "site": "purplepr.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 358, "org": "Lindsey Media", "name": "Collina Strada Contact", "email": "linds@lindsey.media", "email2": "lindsey@lindsey.media", "site": "lindsey.media", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 359, "org": "Edelman", "name": "Brittany Herrmann", "email": "brittany.herrmann@edelman.com", "email2": "jessica.moschella@edelman.com", "site": "edelman.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 360, "org": "Edelman", "name": "Jessica Moschella", "email": "jessica.moschella@edelman.com", "email2": "brittany.herrmann@edelman.com", "site": "edelman.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 361, "org": "CFDA", "name": "A. Sandall", "email": "a.sandall@cfda.com", "email2": "", "site": "cfda.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 362, "org": "VSJ Consulting", "name": "Emily (VSJ)", "email": "emily@vsj-consulting.com", "email2": "carmenlucia@vsj-consulting.com", "site": "vsj-consulting.com", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 363, "org": "Area", "name": "Area RSVP", "email": "rsvp@area.nyc", "email2": "maggie@area.nyc", "site": "area.nyc", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 364, "org": "Area", "name": "Maggie (Area)", "email": "maggie@area.nyc", "email2": "requests@area.nyc", "site": "area.nyc", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 365, "org": "Rep Agency", "name": "Private Policy PR", "email": "privatepolicy@rep-agency.com", "email2": "", "site": "rep-agency.com", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 366, "org": "Calvin Klein", "name": "Lisa Lupinski", "email": "lisalupinski@ck.com", "email2": "", "site": "ck.com", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 367, "org": "FFORME", "name": "FFORME Press", "email": "press@fforme.com", "email2": "", "site": "fforme.com", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 368, "org": "Ashlyn New York", "name": "Nancy (Ashlyn)", "email": "nancy@ashlynnewyork.com", "email2": "", "site": "ashlynnewyork.com", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 369, "org": "Purple PR", "name": "Victor Leonard", "email": "victor.leonard@purplepr.com", "email2": "info@purplepr.com", "site": "purplepr.com", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 370, "org": "VSJ Consulting", "name": "Carmen Lucia", "email": "carmenlucia@vsj-consulting.com", "email2": "emily@vsj-consulting.com", "site": "vsj-consulting.com", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 371, "org": "Lindsey Media", "name": "Wiederhoeft RSVP", "email": "wiederhoeft@lindsey.media", "email2": "linds@lindsey.media", "site": "lindsey.media", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 372, "org": "LEDE Company", "name": "Alexander Wang PR", "email": "alexanderwang@ledecompany.com", "email2": "", "site": "ledecompany.com", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 373, "org": "The Hinton Group", "name": "Sergio Hudson — Direct", "email": "sergio@thehintongroup.co", "email2": "omari@thehintongroup.co", "site": "thehintongroup.co", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 374, "org": "alice + olivia", "name": "GW Store RSVP", "email": "gwstore@aliceandolivia.com", "email2": "", "site": "aliceandolivia.com", "note": "alice + olivia Greenwich store VIP shopping event | Sep 4, 2–4pm | 335 Greenwich Ave | Stylist: Tina Broccole"}, {"id": 375, "org": "CLD PR / Style House", "name": "Caity (CLD PR)", "email": "caity@cldstylehouse.com", "email2": "michelle@cldstylehouse.com", "site": "cldstylehouse.com", "note": "NYFW SS26 Kickoff Event RSVP | Sep 12, 2025, 9am–4pm | W Hotel Times Square, 1567 Broadway NYC"}, {"id": 376, "org": "CLD PR / Style House", "name": "Michelle (CLD PR)", "email": "michelle@cldstylehouse.com", "email2": "caity@cldstylehouse.com", "site": "cldstylehouse.com", "note": "CLD PR NYFW Kickoff — brand activation inquiries & opt-in | @CLDSTYLE"}, {"id": 377, "org": "Alexander Wang", "name": "RSVP Desk", "email": "rsvp@alexanderwang.com", "email2": "press@alexanderwang.com", "site": "alexanderwang.com", "note": "Alexander Wang SS26 NYFW | Sep 12, 2025"}, {"id": 378, "org": "Alexander Wang", "name": "Press Desk", "email": "press@alexanderwang.com", "email2": "rsvp@alexanderwang.com", "site": "alexanderwang.com", "note": "Alexander Wang SS26 NYFW Press | Sep 12, 2025"}, {"id": 379, "org": "KCD Worldwide", "name": "Alexander Wang Requests", "email": "request@kcdworldwide.com", "email2": "rsvp@alexanderwang.com", "site": "kcdworldwide.com", "note": "Alexander Wang SS26 via KCD Worldwide | Sep 12, 2025"}, {"id": 380, "org": "Alexander Wang", "name": "Patrick Hunt", "email": "patrick.hunt@alexanderwang.com", "email2": "james.mccullagh@alexanderwang.com", "site": "alexanderwang.com", "note": "Alexander Wang SS26 NYFW | Named press contact"}, {"id": 381, "org": "Alexander Wang", "name": "James McCullagh", "email": "james.mccullagh@alexanderwang.com", "email2": "patrick.hunt@alexanderwang.com", "site": "alexanderwang.com", "note": "Alexander Wang SS26 NYFW | Named press contact"}, {"id": 382, "org": "Purple Brand", "name": "NYFW Events", "email": "nyfw@purple-brand.com", "email2": "", "site": "purple-brand.com", "note": "Purple Brand NYFW Block Party | Sep 12, 2025, 5–9pm | 50 Howard St, NY 10013 | Non-transferable"}, {"id": 383, "org": "Christian Siriano Collection", "name": "PR Desk (Collection)", "email": "pr@christiansirianocollection.com", "email2": "pr@christiansiriano.com", "site": "christiansirianocollection.com", "note": "NYFW: Christian Siriano SS26 runway show | Sep 11, 2025, 3pm NYC"}, {"id": 384, "org": "Christian Siriano", "name": "PR Desk (Direct)", "email": "pr@christiansiriano.com", "email2": "pr@christiansirianocollection.com", "site": "christiansiriano.com", "note": "NYFW: Christian Siriano SS26 — alternate press contact"}, {"id": 385, "org": "Maximus Communications", "name": "Info Desk", "email": "info@maximuscommunications.com", "email2": "", "site": "maximuscommunications.com", "note": "NYFW: PASSÉ VIP opening — Brad Walls solo US exhibition | Sep 11, 2025, 6–9pm | Sohotel, 347 Broome St NY 10013"}, {"id": 386, "org": "What Goes Around Comes Around", "name": "RSVP", "email": "rsvp@wgacany.com", "email2": "marketing@wgacany.com", "site": "wgacany.com", "note": "WGACA x Law Roach — Exclusive Archival Fashion Installation | Sep 11, 2025, 7–9pm | WGACA Atelier, 113 Wooster St, Soho | 21+"}, {"id": 387, "org": "What Goes Around Comes Around", "name": "Press Inquiries", "email": "marketing@wgacany.com", "email2": "rsvp@wgacany.com", "site": "wgacany.com", "note": "WGACA — Press inquiries & marketing contact"}, {"id": 388, "org": "Special Projects Media", "name": "W Magazine Events", "email": "wmagazine@specialprojectsmedia.com", "email2": "", "site": "specialprojectsmedia.com", "note": "W Magazine x Bloomingdale's NYFW Celebration | Sep 11, 2025 | Details TBC"}, {"id": 389, "org": "Michael Kors", "name": "Mona Swanson", "email": "mona.swanson@michaelkors.com", "email2": "raya.goonetilleke@michaelkors.com", "site": "michaelkors.com", "note": "Michael Kors Collection SS26 runway show | Sep 11, 2025, 11am | NYFW — embargoed"}, {"id": 390, "org": "RK Communications", "name": "Nicole Allen", "email": "nicole@rkcommunications.us", "email2": "", "site": "rkcommunications.us", "note": "CAMPBELL&KRAMER NYFW Party | Sep 10, 2025, 5–8pm | Café Forgot, 29 Ludlow St NY 10002"}, {"id": 391, "org": "Karla Otto PR", "name": "Jessica McCormack RSVP", "email": "jessicamccormackrsvp@karlaotto.com", "email2": "elgene.castueras@karlaotto.com", "site": "karlaotto.com", "note": "Jessica McCormack x Zoë Kravitz celebration — Jessica's NY arrival | Sep 10, 2025, 7pm | The Frick, 1 E 70th St NY 10021"}, {"id": 392, "org": "Miss Circle New York", "name": "PR Desk", "email": "pr@misscircle.com", "email2": "", "site": "misscircle.com", "note": "NYFW Red Label Presentation | 7–9pm presentation + 9–10pm after party"}, {"id": 393, "org": "Lanvin", "name": "SOHO Events", "email": "soho@lanvin.com", "email2": "", "site": "lanvin.com", "note": "Lanvin x GSH Contemporary — AW25 debut collection preview | Sep 10, 2025, 5–9pm | Sutton Tower, 430 E 58th St PH78, NY 10022"}, {"id": 394, "org": "Moda Operandi", "name": "Fendi Events", "email": "fendi@modaoperandi.com", "email2": "", "site": "modaoperandi.com", "note": "Fendi Roma Spy Bag NYFW celebration hosted by Lauren Santo Domingo | Sep 9, 2025, 7–9pm | Chez Fifi, 140 E 74th St NYC | Non-transferable"}, {"id": 395, "org": "Fairchild Fashion Media", "name": "M. Rocco", "email": "mrocco@fairchildfashion.com", "email2": "", "site": "fairchildfashion.com", "note": "WWD x FN x Beauty Inc Women in Power Annual Gala (4th edition) | Sep 8, 2025 | The Glasshouses, 545 W 25th St 21F NY 10001"}, {"id": 396, "org": "Prada", "name": "Fashion Press", "email": "fashionpress@prada.com", "email2": "", "site": "prada.com", "note": "Prada Paradigme fragrance launch party | Sep 6, 2025, 9pm | 281 Park Ave South NY 10010"}, {"id": 397, "org": "International Tennis Hall of Fame", "name": "N. Kowalsick", "email": "nkowalsick@tennisfame.com", "email2": "bcarnevale@tennisfame.com", "site": "tennisfame.com", "note": "The Legends Ball — Annual ITHF gala during US Open (10th edition) | Sep 6, 2025, 7pm | Ziegfeld Ballroom, 141 W 54th St NY 10019"}, {"id": 398, "org": "International Tennis Hall of Fame", "name": "B. Carnevale", "email": "bcarnevale@tennisfame.com", "email2": "nkowalsick@tennisfame.com", "site": "tennisfame.com", "note": "The Legends Ball — Annual ITHF gala during US Open | Sep 6, 2025"}, {"id": 399, "org": "Public Serv-ce", "name": "Press / RSVP", "email": "press@publicserv-ce.com", "email2": "sales@publicserv-ce.com", "site": "publicserv-ce.com", "note": "Public Serv-ce SS26 'Street Tailorism' | Sep 14, 2025, 5pm | 101 Reade St, NYC 10013"}, {"id": 400, "org": "Public Serv-ce", "name": "Commercial / Sales", "email": "sales@publicserv-ce.com", "email2": "press@publicserv-ce.com", "site": "publicserv-ce.com", "note": "Public Serv-ce SS26 — commercial/sales contact | @publicserv_ce"}, {"id": 401, "org": "Fashion Bomb Daily", "name": "Events Team", "email": "events@fashionbombdaily.com", "email2": "", "site": "fashionbombdaily.com", "note": "The Bomb Fashion Show — NYFW show/sponsorship inquiries | fashionbombdaily.com"}, {"id": 402, "org": "Durkin Entertainment", "name": "Debbie (EcoLuxe)", "email": "debbie@durkinentertainment.com", "email2": "", "site": "durkinentertainment.com", "note": "EcoLuxe Lounge — Endless Summer Festival (Emmys season) | Sep 13, 2025, 11:30am–5pm | Beverly Hills CA 90210"}, {"id": 403, "org": "True Blue PR", "name": "RSVP / Press", "email": "hello@truebluepr.com", "email2": "", "site": "truebluepr.com", "note": "Bibiré SS26 Spring/Summer Preview | Sep 12, 2025, 7pm | Brooklyn Chophouse, 253 W 47th St NYC"}, {"id": 404, "org": "Center Theatre Group", "name": "Gil Diaz (Music Ctr)", "email": "gdiaz@musiccenter.org", "email2": "ctgmedia@ctgla.org", "site": "musiccenter.org", "note": "Kim's Convenience; Beverly Hills play — Music Center co-presenter"}, {"id": 405, "org": "Interscope Capitol", "name": "Lisa DiAngelo", "email": "lisa.diangelo@umusic.com", "email2": "nicole.crystal@umusic.com", "site": "umusic.com", "note": "Disclosure Spring 2026 North America Tour — Santa Barbara Bowl kickoff"}, {"id": 406, "org": "Interscope Capitol", "name": "Nicole Crystal", "email": "nicole.crystal@umusic.com", "email2": "lisa.diangelo@umusic.com", "site": "umusic.com", "note": "Disclosure Tour — secondary contact"}, {"id": 407, "org": "Blue Note LA", "name": "Contact", "email": "info@bluenotejazz.com", "email2": "", "site": "bluenotejazz.com", "note": "Robert Glasper Residency — 6374 Sunset Blvd, LA"}, {"id": 408, "org": "Amoeba Music", "name": "Press", "email": "contact@amoeba.com", "email2": "", "site": "amoeba.com", "note": "Arlo Parks Album Listening Party — 6200 Hollywood Blvd, Hollywood"}, {"id": 409, "org": "Hollywood Beauty Awards", "name": "Info", "email": "info@hollywoodbeautyawards.com", "email2": "", "site": "hollywoodbeautyawards.com", "note": "Hollywood Beauty Awards — Taglyan Center, 1201 N. Vine St, Hollywood"}, {"id": 410, "org": "Coachella", "name": "Press", "email": "press@coachella.com", "email2": "", "site": "coachella.com", "note": "Coachella Valley Music & Arts Festival 2026 — April 10-12/17-19"}];

const EVENTS_DATA = [{"month": "January", "date": "Jan 1", "title": "New Year's Day", "category": "Holiday", "endDate": "", "note": "Global public holiday", "source": "Cision"}, {"month": "January", "date": "Jan 2", "title": "Science Fiction Day", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 3", "title": "Mahayana", "category": "Cultural", "endDate": "", "note": "Buddhist holiday", "source": "Cision"}, {"month": "January", "date": "Jan 6", "title": "Consumer Electronics Show (CES)", "category": "Tech", "endDate": "Jan 9", "note": "Las Vegas — major tech launch platform", "source": "Cision"}, {"month": "January", "date": "Jan 7", "title": "Orthodox Christmas Day", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 11", "title": "Golden Globes", "category": "Entertainment", "endDate": "", "note": "Beverly Hills — TV/Film awards season opener", "source": "Cision"}, {"month": "January", "date": "Jan 12", "title": "Australian Open Tennis", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 13", "title": "Creator Economy Live West", "category": "Media/PR", "endDate": "Feb 1", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 14", "title": "Orthodox New Year", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 17", "title": "International Mentoring Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 19", "title": "Martin Luther King Jr. Day", "category": "Holiday", "endDate": "", "note": "U.S. federal holiday", "source": "Cision"}, {"month": "January", "date": "Jan 19", "title": "World Economic Forum", "category": "Media/PR", "endDate": "Jan 23", "note": "Davos, Switzerland", "source": "Cision"}, {"month": "January", "date": "Jan 21", "title": "Int'l Media Marketplace North America", "category": "Media/PR", "endDate": "Jan 22", "note": "", "source": "Cision / Media Contacts"}, {"month": "January", "date": "Jan 22", "title": "Sundance Film Festival", "category": "Film", "endDate": "Feb 1", "note": "Park City, Utah", "source": "Cision"}, {"month": "January", "date": "Jan 23", "title": "Winter X Games", "category": "Sports", "endDate": "Jan 25", "note": "Aspen, Colorado", "source": "Cision"}, {"month": "January", "date": "Jan 24", "title": "International Education Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 24", "title": "New York Travel Show", "category": "Media/PR", "endDate": "Jan 25", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 27", "title": "Holocaust Remembrance Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 27", "title": "National Geographic Day", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 28", "title": "Data Privacy Day", "category": "Tech", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 30", "title": "MusiCares Person of the Year", "category": "Music", "endDate": "", "note": "Mariah Carey — Grammy Week LA", "source": "Media Contacts"}, {"month": "January", "date": "Jan 31", "title": "UMG Brunch", "category": "Music", "endDate": "", "note": "Nya Studios WEST, 1520 Wilcox Ave, 10am–3pm", "source": "Media Contacts"}, {"month": "January", "date": "Jan 31", "title": "YouTube PAMOJA", "category": "Music", "endDate": "", "note": "Los Angeles, 1–6pm — Afrobeats/African music", "source": "Media Contacts"}, {"month": "January", "date": "Jan 31", "title": "Recording Academy Golden Hour", "category": "Music", "endDate": "", "note": "Rolling Greens on Mateo, 1–4pm", "source": "Media Contacts"}, {"month": "January", "date": "Jan 31", "title": "Recording Academy Academy Proud", "category": "Music", "endDate": "", "note": "Rolling Greens on Mateo, 7–10pm", "source": "Media Contacts"}, {"month": "January", "date": "Jan 31", "title": "Clive Davis Pre-Grammy Gala", "category": "Music", "endDate": "", "note": "The Beverly Hilton, 6–11pm", "source": "Media Contacts"}, {"month": "January", "date": "Jan 31", "title": "Pitchfork x Best New Music Party", "category": "Music", "endDate": "", "note": "El Cid, 4212 W. Sunset Blvd, 9pm", "source": "Media Contacts"}, {"month": "January", "date": "Jan 31", "title": "UnitedMasters Celebration of Independence", "category": "Music", "endDate": "", "note": "Hollywood Palladium, 9pm", "source": "Media Contacts"}, {"month": "February", "date": "Feb 1", "title": "68th Annual Grammy Awards", "category": "Music", "endDate": "", "note": "Crypto Arena, Los Angeles", "source": "Media Contacts"}, {"month": "February", "date": "Feb 1", "title": "UMG Grammy Afterparty", "category": "Music", "endDate": "", "note": "Grammy Week — LA", "source": "Media Contacts"}, {"month": "February", "date": "Feb 2", "title": "Groundhog Day", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 4", "title": "World Cancer Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 6", "title": "AI Action Summit", "category": "Tech", "endDate": "Feb 11", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 6", "title": "Winter Olympic Games", "category": "Sports", "endDate": "Feb 22", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 7", "title": "78th DGA Awards", "category": "Film", "endDate": "", "note": "Awards season", "source": "Media Contacts"}, {"month": "February", "date": "Feb 7", "title": "Chicago Auto Show", "category": "Cultural", "endDate": "Feb 16", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 8", "title": "Super Bowl LX", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 9", "title": "34th Pan African Film & Arts Festival", "category": "Film", "endDate": "Feb 16", "note": "PAFF — Los Angeles", "source": "Media Contacts"}, {"month": "February", "date": "Feb 10", "title": "Safer Internet Day", "category": "Tech", "endDate": "", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 12", "title": "Berlin Film Festival", "category": "Film", "endDate": "Feb 22", "note": "Berlinale", "source": "Cision"}, {"month": "February", "date": "Feb 12", "title": "28th Costume Designers Guild Awards", "category": "Entertainment", "endDate": "", "note": "", "source": "Media Contacts"}, {"month": "February", "date": "Feb 12", "title": "ASCAP Experience", "category": "Music", "endDate": "", "note": "", "source": "Media Contacts"}, {"month": "February", "date": "Feb 12", "title": "WGA Beyond Words", "category": "Film", "endDate": "", "note": "WGA Foundation event", "source": "Media Contacts"}, {"month": "February", "date": "Feb 12", "title": "New York Fashion Week", "category": "Fashion", "endDate": "Feb 17", "note": "NYFW — major US fashion event", "source": "Cision"}, {"month": "February", "date": "Feb 13", "title": "World Radio Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 13", "title": "Munich Security Conference", "category": "Media/PR", "endDate": "Feb 15", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 14", "title": "Valentine's Day", "category": "Holiday", "endDate": "", "note": "Major retail/brand activation moment", "source": "Cision"}, {"month": "February", "date": "Feb 15", "title": "41st Film Independent Spirit Awards", "category": "Film", "endDate": "", "note": "", "source": "Media Contacts"}, {"month": "February", "date": "Feb 15", "title": "NBA All-Star Game", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 16", "title": "Presidents' Day", "category": "Holiday", "endDate": "", "note": "U.S. federal holiday", "source": "Cision"}, {"month": "February", "date": "Feb 17", "title": "Mardi Gras / Shrove Tuesday", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 17", "title": "Chinese New Year", "category": "Holiday", "endDate": "", "note": "Year of the Snake", "source": "Cision"}, {"month": "February", "date": "Feb 17", "title": "Ramadan begins", "category": "Holiday", "endDate": "Mar 18", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 18", "title": "Slamdance Film Festival", "category": "Film", "endDate": "Feb 25", "note": "", "source": "Media Contacts"}, {"month": "February", "date": "Feb 19", "title": "London Fashion Week", "category": "Fashion", "endDate": "Feb 23", "note": "LFW — major UK fashion event", "source": "Cision"}, {"month": "February", "date": "Feb 22", "title": "BAFTA Film Awards", "category": "Film", "endDate": "", "note": "London", "source": "Cision"}, {"month": "February", "date": "Feb 24", "title": "Marketing & Communications Summit", "category": "Media/PR", "endDate": "Feb 26", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 24", "title": "Milan Fashion Week", "category": "Fashion", "endDate": "Mar 2", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 28", "title": "57th NAACP Image Awards", "category": "Entertainment", "endDate": "", "note": "", "source": "Media Contacts"}, {"month": "February", "date": "Feb 28", "title": "37th Producers Guild Awards", "category": "Film", "endDate": "", "note": "", "source": "Media Contacts"}, {"month": "March", "date": "Mar 1", "title": "32nd SAG Awards", "category": "Entertainment", "endDate": "", "note": "On Netflix", "source": "Media Contacts"}, {"month": "March", "date": "Mar 1", "title": "Tokyo Marathon", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 2", "title": "Paris Fashion Week", "category": "Fashion", "endDate": "Mar 10", "note": "PFW — major global fashion event", "source": "Cision"}, {"month": "March", "date": "Mar 2", "title": "Mobile World Congress", "category": "Tech", "endDate": "Mar 5", "note": "Barcelona", "source": "Cision"}, {"month": "March", "date": "Mar 3", "title": "World Wildlife Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 3", "title": "Holi — Hindu Festival of Color", "category": "Holiday", "endDate": "Mar 4", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 5", "title": "37th GLAAD Media Awards", "category": "Entertainment", "endDate": "", "note": "", "source": "Media Contacts"}, {"month": "March", "date": "Mar 6", "title": "Winter Paralympics", "category": "Sports", "endDate": "Mar 15", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 8", "title": "International Women's Day", "category": "Awareness", "endDate": "", "note": "Global — major brand activation moment", "source": "Cision"}, {"month": "March", "date": "Mar 8", "title": "40th ASC Awards", "category": "Film", "endDate": "", "note": "American Society of Cinematographers", "source": "Media Contacts"}, {"month": "March", "date": "Mar 9", "title": "Ragan Social Media Conference", "category": "Media/PR", "endDate": "Mar 11", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 9", "title": "Int'l Media Marketplace UK", "category": "Media/PR", "endDate": "Mar 10", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 12", "title": "SXSW", "category": "Tech", "endDate": "Mar 18", "note": "Austin, TX — music, film, tech convergence", "source": "Cision"}, {"month": "March", "date": "Mar 15", "title": "Academy Awards / Oscars", "category": "Film", "endDate": "", "note": "98th Oscars — Dolby Theatre, Hollywood", "source": "Cision / Media Contacts"}, {"month": "March", "date": "Mar 15", "title": "Elton John AIDS Foundation Oscar Party", "category": "Entertainment", "endDate": "", "note": "Oscar viewing party", "source": "Media Contacts"}, {"month": "March", "date": "Mar 17", "title": "St. Patrick's Day", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 17", "title": "NCAA Finals / March Madness begins", "category": "Sports", "endDate": "Apr 6", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 17", "title": "NCAA Finals/March Madness begins", "category": "Sports", "endDate": "Apr 6", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 20", "title": "Spring Equinox", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 28", "title": "Earth Hour", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 31", "title": "Int'l Transgender Day of Visibility", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 1", "title": "April Fool's Day", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 1", "title": "Passover begins", "category": "Holiday", "endDate": "Apr 9", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 2", "title": "World Autism Awareness Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 2", "title": "Holy Thursday", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 3", "title": "Good Friday", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 5", "title": "Easter Sunday", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 7", "title": "World Health Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 9", "title": "Masters Tournament", "category": "Sports", "endDate": "Apr 12", "note": "Augusta, Georgia", "source": "Cision"}, {"month": "April", "date": "Apr 10", "title": "Coachella", "category": "Music", "endDate": "Apr 19", "note": "Indio, CA — major artist/brand platform", "source": "Cision"}, {"month": "April", "date": "Apr 12", "title": "Paris Marathon", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 14", "title": "Social Media Week", "category": "Media/PR", "endDate": "Apr 16", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 15", "title": "Tax Day (U.S.)", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 15", "title": "World Art Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 19", "title": "NBA Playoffs begin", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 20", "title": "Boston Marathon", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 21", "title": "Int'l Creativity & Innovation Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 22", "title": "Earth Day", "category": "Awareness", "endDate": "", "note": "Global — sustainability campaigns", "source": "Cision"}, {"month": "April", "date": "Apr 26", "title": "London Marathon", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 27", "title": "POSSIBLE Conference", "category": "Media/PR", "endDate": "Apr 29", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 28", "title": "Social Media Marketing World", "category": "Media/PR", "endDate": "Apr 30", "note": "", "source": "Cision"}, {"month": "May", "date": "May 2", "title": "Kentucky Derby", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "May", "date": "May 3", "title": "World Press Freedom Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "May", "date": "May 4", "title": "Met Gala", "category": "Fashion", "endDate": "", "note": "Metropolitan Museum of Art, NYC — top fashion event", "source": "Cision"}, {"month": "May", "date": "May 4", "title": "Star Wars Day", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "May", "date": "May 5", "title": "Cinco de Mayo", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "May", "date": "May 9", "title": "Europe Day", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "May", "date": "May 10", "title": "Mother's Day (U.S.)", "category": "Holiday", "endDate": "", "note": "Major retail/brand moment", "source": "Cision"}, {"month": "May", "date": "May 11", "title": "PGA Championship", "category": "Sports", "endDate": "May 17", "note": "", "source": "Cision"}, {"month": "May", "date": "May 12", "title": "Cannes Film Festival", "category": "Film", "endDate": "May 23", "note": "Cannes, France", "source": "Cision"}, {"month": "May", "date": "May 14", "title": "PR360 Conference", "category": "Media/PR", "endDate": "May 15", "note": "", "source": "Cision"}, {"month": "May", "date": "May 18", "title": "French Open Tennis", "category": "Sports", "endDate": "Jun 7", "note": "Roland Garros, Paris", "source": "Cision"}, {"month": "May", "date": "May 25", "title": "Memorial Day", "category": "Holiday", "endDate": "", "note": "U.S. federal holiday", "source": "Cision"}, {"month": "May", "date": "May 25", "title": "Africa Day", "category": "Cultural", "endDate": "", "note": "Relevant — Afrobeats/African culture content", "source": "Cision"}, {"month": "May", "date": "May 30", "title": "UEFA Champions League Final", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "June", "date": "Jun 1", "title": "Pride Month begins", "category": "Awareness", "endDate": "Jun 30", "note": "LGBTQ+ — major brand activation month", "source": "Cision"}, {"month": "June", "date": "Jun 3", "title": "PR Daily Conference", "category": "Media/PR", "endDate": "Jun 5", "note": "", "source": "Cision"}, {"month": "June", "date": "Jun 5", "title": "F1 Monaco Grand Prix", "category": "Sports", "endDate": "Jun 7", "note": "", "source": "Cision"}, {"month": "June", "date": "Jun 5", "title": "World Environment Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "June", "date": "Jun 8", "title": "World Oceans Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "June", "date": "Jun 11", "title": "FIFA World Cup begins", "category": "Sports", "endDate": "Jul 19", "note": "Major global sports event", "source": "Cision"}, {"month": "June", "date": "Jun 14", "title": "IABC World Conference", "category": "Media/PR", "endDate": "Jun 16", "note": "", "source": "Cision"}, {"month": "June", "date": "Jun 19", "title": "Juneteenth", "category": "Holiday", "endDate": "", "note": "U.S. federal holiday", "source": "Cision"}, {"month": "June", "date": "Jun 21", "title": "Father's Day", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "June", "date": "Jun 21", "title": "Summer Solstice", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "June", "date": "Jun 22", "title": "Cannes Lions", "category": "Media/PR", "endDate": "Jun 26", "note": "Cannes, France — major creative/advertising festival", "source": "Cision"}, {"month": "June", "date": "Jun 29", "title": "Wimbledon Tennis", "category": "Sports", "endDate": "Jul 12", "note": "", "source": "Cision"}, {"month": "July", "date": "Jul 1", "title": "Canada Day", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "July", "date": "Jul 3", "title": "F1 British Grand Prix", "category": "Sports", "endDate": "Jul 5", "note": "", "source": "Cision"}, {"month": "July", "date": "Jul 4", "title": "U.S. Independence Day", "category": "Holiday", "endDate": "", "note": "U.S. federal holiday", "source": "Cision"}, {"month": "July", "date": "Jul 4", "title": "Tour de France begins", "category": "Sports", "endDate": "Jul 26", "note": "", "source": "Cision"}, {"month": "July", "date": "Jul 14", "title": "Bastille Day", "category": "Holiday", "endDate": "", "note": "France", "source": "Cision"}, {"month": "July", "date": "Jul 14", "title": "2026 MLB All-Star Game", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "July", "date": "Jul 14", "title": "Int'l Non-Binary People's Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "July", "date": "Jul 16", "title": "World PR Day", "category": "Media/PR", "endDate": "", "note": "", "source": "Cision"}, {"month": "July", "date": "Jul 18", "title": "Nelson Mandela Day", "category": "Cultural", "endDate": "", "note": "Relevant — South Africa / Africa content", "source": "Cision"}, {"month": "July", "date": "Jul 23", "title": "Commonwealth Games", "category": "Sports", "endDate": "Aug 2", "note": "", "source": "Cision"}, {"month": "July", "date": "Jul 30", "title": "International Day of Friendship", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "August", "date": "Aug 1", "title": "World Wide Web Day", "category": "Tech", "endDate": "", "note": "", "source": "Cision"}, {"month": "August", "date": "Aug 7", "title": "International Beer Day", "category": "Cultural", "endDate": "", "note": "Bacardi / Sovereign Brands activation opp", "source": "Cision"}, {"month": "August", "date": "Aug 12", "title": "International Youth Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "August", "date": "Aug 19", "title": "World Humanitarian Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "August", "date": "Aug 25", "title": "Mawlid al-Nabi", "category": "Holiday", "endDate": "Aug 26", "note": "", "source": "Cision"}, {"month": "August", "date": "Aug 29", "title": "American Apparel With Love Cocktail", "category": "Fashion", "endDate": "", "note": "NYFW SS25 lead-up", "source": "NYFW Contacts"}, {"month": "August", "date": "Aug 30", "title": "Burning Man", "category": "Cultural", "endDate": "Sep 6", "note": "Black Rock City, Nevada", "source": "Cision"}, {"month": "August", "date": "Aug 31", "title": "U.S. Tennis Open begins", "category": "Sports", "endDate": "Sep 13", "note": "USTA Billie Jean King National Tennis Center", "source": "Cision"}, {"month": "September", "date": "Sep 4", "title": "Harper's Bazaar Icons Issue NYFW Kickoff", "category": "Fashion", "endDate": "", "note": "NYFW SS25", "source": "NYFW Contacts"}, {"month": "September", "date": "Sep 4", "title": "New York Fashion Week SS25 begins", "category": "Fashion", "endDate": "Sep 11", "note": "Major global fashion event", "source": "NYFW Contacts / Cision"}, {"month": "September", "date": "Sep 4", "title": "Daily Front Row NYFW Kickoff", "category": "Fashion", "endDate": "", "note": "with Ana Sky", "source": "NYFW Contacts"}, {"month": "September", "date": "Sep 5", "title": "Billboard R&B Hip-Hop Power Players Dinner", "category": "Music", "endDate": "", "note": "", "source": "NYFW Contacts"}, {"month": "September", "date": "Sep 5", "title": "Ralph Lauren Runway Show", "category": "Fashion", "endDate": "", "note": "NYFW SS25", "source": "NYFW Contacts"}, {"month": "September", "date": "Sep 6", "title": "Fashion Media Awards", "category": "Fashion", "endDate": "", "note": "Daily Front Row", "source": "NYFW Contacts"}, {"month": "September", "date": "Sep 7", "title": "Labor Day (U.S.)", "category": "Holiday", "endDate": "", "note": "U.S. federal holiday", "source": "Cision"}, {"month": "September", "date": "Sep 10", "title": "World Suicide Prevention Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 10", "title": "International Makeup Day", "category": "Fashion", "endDate": "", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 11", "title": "Rosh Hashanah", "category": "Holiday", "endDate": "Sep 13", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 15", "title": "Hispanic Heritage Month begins", "category": "Awareness", "endDate": "Oct 15", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 16", "title": "INBOUND Conference", "category": "Media/PR", "endDate": "Sep 18", "note": "HubSpot conference", "source": "Cision"}, {"month": "September", "date": "Sep 17", "title": "London Fashion Week", "category": "Fashion", "endDate": "Sep 21", "note": "LFW — major UK fashion event", "source": "Cision"}, {"month": "September", "date": "Sep 20", "title": "Yom Kippur", "category": "Holiday", "endDate": "Sep 21", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 21", "title": "Int'l Day of Peace", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 23", "title": "Autumn Equinox", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 25", "title": "Sukkot begins", "category": "Holiday", "endDate": "Oct 2", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 27", "title": "Berlin Marathon", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 30", "title": "International Podcast Day", "category": "Media/PR", "endDate": "", "note": "Relevant for DR content strategy", "source": "Cision"}, {"month": "October", "date": "Oct 1", "title": "International Conference on Comms & Media Studies", "category": "Media/PR", "endDate": "Oct 2", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 1", "title": "International Music Day", "category": "Music", "endDate": "", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 4", "title": "World Animal Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 5", "title": "World Teachers' Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 10", "title": "World Mental Health Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 11", "title": "National Coming Out Day (U.S.)", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 11", "title": "Chicago Marathon", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 12", "title": "Indigenous Peoples' Day", "category": "Holiday", "endDate": "", "note": "U.S.", "source": "Cision"}, {"month": "October", "date": "Oct 16", "title": "World Food Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 22", "title": "Global PR Summit Middle East", "category": "Media/PR", "endDate": "Oct 23", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 24", "title": "United Nations Day", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 31", "title": "Halloween", "category": "Holiday", "endDate": "", "note": "Major brand/retail moment", "source": "Cision"}, {"month": "November", "date": "Nov 1", "title": "New York Marathon", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "November", "date": "Nov 1", "title": "All Saints' Day", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "November", "date": "Nov 8", "title": "Diwali", "category": "Holiday", "endDate": "Nov 12", "note": "", "source": "Cision"}, {"month": "November", "date": "Nov 11", "title": "Veterans Day", "category": "Holiday", "endDate": "", "note": "U.S. federal holiday", "source": "Cision"}, {"month": "November", "date": "Nov 13", "title": "World Kindness Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "November", "date": "Nov 14", "title": "World Diabetes Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "November", "date": "Nov 15", "title": "World Public Relations Forum", "category": "Media/PR", "endDate": "Nov 21", "note": "", "source": "Cision"}, {"month": "November", "date": "Nov 21", "title": "World Television Day", "category": "Entertainment", "endDate": "", "note": "", "source": "Cision"}, {"month": "November", "date": "Nov 26", "title": "Thanksgiving", "category": "Holiday", "endDate": "", "note": "U.S. — major retail/brand activation", "source": "Cision"}, {"month": "November", "date": "Nov 27", "title": "Black Friday", "category": "Cultural", "endDate": "", "note": "Major retail moment", "source": "Cision"}, {"month": "November", "date": "Nov 28", "title": "Small Business Saturday", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "November", "date": "Nov 30", "title": "Cyber Monday", "category": "Cultural", "endDate": "", "note": "E-commerce peak day", "source": "Cision"}, {"month": "December", "date": "Dec 1", "title": "World AIDS Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 1", "title": "Giving Tuesday", "category": "Cultural", "endDate": "", "note": "Global generosity movement", "source": "Cision"}, {"month": "December", "date": "Dec 4", "title": "Hanukkah begins", "category": "Holiday", "endDate": "Dec 12", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 5", "title": "International Volunteer Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 10", "title": "Human Rights Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 14", "title": "Green Monday", "category": "Cultural", "endDate": "", "note": "E-commerce", "source": "Cision"}, {"month": "December", "date": "Dec 19", "title": "Super Saturday", "category": "Cultural", "endDate": "", "note": "Retail", "source": "Cision"}, {"month": "December", "date": "Dec 21", "title": "Winter Solstice", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 24", "title": "Christmas Eve", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 25", "title": "Christmas Day", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 26", "title": "Kwanzaa begins", "category": "Holiday", "endDate": "Jan 1", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 26", "title": "Boxing Day (UK)", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 31", "title": "New Year's Eve", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "Holiday", "date": "", "title": "Entertainment", "category": "", "endDate": "Fashion", "note": "", "source": "Media/PR"}, {"month": "Sports", "date": "", "title": "Cultural", "category": "", "endDate": "Music", "note": "", "source": "Film"}, {"month": "Tech", "date": "", "title": "Awareness", "category": "", "endDate": "", "note": "", "source": ""}, {"month": "March", "date": "Mar 17", "title": "The Boys Final Season Virtual Global Press Junket", "category": "Entertainment", "endDate": "", "note": "42West | TheBoys@42West.com | Virtual | Cast and showrunner global press day", "source": "NIA Database"}, {"month": "March", "date": "Mar 17", "title": "The Daughters of Dolomite Preview Screening", "category": "Film", "endDate": "", "note": "Jazzmyne PR | jazzmynepr@gmail.com | LOOK Dine-In Cinemas, 128 Artsakh Ave, Glendale | Foster Corder, Gary Anthony Sturgis", "source": "NIA Database"}, {"month": "March", "date": "Mar 17", "title": "Liza Minnelli Live in Conversation", "category": "Entertainment", "endDate": "", "note": "How To Academy | contact@howtoacademy.com | Million Dollar Theater, 307 S. Broadway, Downtown LA", "source": "NIA Database"}, {"month": "March", "date": "Mar 17", "title": "DINASTÍA Tour — Peso Pluma", "category": "Music", "endDate": "", "note": "Elina Adut (The Exclusive Agency) | eadut@eadut.com | Acrisure Arena, 75702 Varner Rd, Thousand Palms", "source": "NIA Database"}, {"month": "March", "date": "Mar 18", "title": "Femme 2026 Power Confab Retreat", "category": "Entertainment", "endDate": "", "note": "Reyna Trevino | reyna@trevinoenterprises.net | The Langham Huntington, 1401 S. Oak Knoll, Pasadena | Michelle Kwan, Soledad O'Brien, Suzette Quintanilla", "source": "NIA Database"}, {"month": "March", "date": "Mar 18", "title": "The English Patient in 35mm Screening", "category": "Film", "endDate": "", "note": "museumpress@oscars.org | Academy Museum David Geffen Theater | Hannah Minghella, Max Minghella", "source": "NIA Database"}, {"month": "March", "date": "Mar 19", "title": "Something Very Bad Is Going to Happen — Netflix Premiere", "category": "Film", "endDate": "", "note": "Paul Panday (APEX PR) | paul@theapex-pr.com | Egyptian Theatre, 6712 Hollywood Blvd | Camila Morrone, Adam DiMarco, Victoria Pedretti", "source": "NIA Database"}, {"month": "March", "date": "Mar 19", "title": "Champions for Children Gala", "category": "Entertainment", "endDate": "", "note": "Harvin Rogas (5B Events) | harvin@5bevents.com | Beverly Wilshire Hotel, 9500 Wilshire Blvd, Beverly Hills", "source": "NIA Database"}, {"month": "March", "date": "Mar 19", "title": "Ron Carter Birthday Celebration Concert", "category": "Music", "endDate": "", "note": "Sharp Associates PR | info@sharpassociatespr.com | Catalina Jazz Club, 6725 W. Sunset Blvd, Hollywood", "source": "NIA Database"}, {"month": "March", "date": "Mar 20", "title": "DINASTÍA Tour — Peso Pluma (Inglewood)", "category": "Music", "endDate": "", "note": "Elina Adut | eadut@eadut.com | Intuit Dome, 3930 W. Century Blvd, Inglewood", "source": "NIA Database"}, {"month": "March", "date": "Mar 20", "title": "Amber Mark — The Pretty Idea Tour", "category": "Music", "endDate": "", "note": "Rebecca Marlis (UMG) | rebecca.marlis@umusic.com | The Fonda Theatre, 6126 Hollywood Blvd", "source": "NIA Database"}, {"month": "March", "date": "Mar 20", "title": "Passing the Torch Awards (Black LGBTQ+)", "category": "Entertainment", "endDate": "", "note": "Christopher Sibley | christophersibley@thesibleyfirm.com | Hotel Indigo, 899 Francisco St, LA", "source": "NIA Database"}, {"month": "March", "date": "Mar 21", "title": "TruthAwards — Black LGBTQ+ Leadership Gala", "category": "Entertainment", "endDate": "", "note": "Christopher Sibley | christophersibley@thesibleyfirm.com | Beverly Hilton, 9876 Wilshire, Beverly Hills | Vivica A. Fox, Don Lemon, Jenifer Lewis", "source": "NIA Database"}, {"month": "March", "date": "Mar 21", "title": "The Sopranos Season 3 25th Anniversary Panel", "category": "Film", "endDate": "", "note": "American Cinematheque | publicity@americancinematheque.com | Egyptian Theatre, Hollywood | David Chase, Steve Buscemi, Terence Winter", "source": "NIA Database"}, {"month": "March", "date": "Mar 21", "title": "Gabriel Iglesias & Jo Koy: One Night Only", "category": "Entertainment", "endDate": "", "note": "Hollywood Park press | press@hollywoodparkca.com | SoFi Stadium, 1001 S. Stadium Dr, Inglewood", "source": "NIA Database"}, {"month": "March", "date": "Mar 21", "title": "VinylCon! Festival", "category": "Music", "endDate": "Mar 22", "note": "Leah Concialdi (Champagne House Media) | leah@champagnehousemedia.com | California Market Center, 110 E. 9th St, LA", "source": "NIA Database"}, {"month": "March", "date": "Mar 21", "title": "Song of the North — Pasadena Playhouse", "category": "Entertainment", "endDate": "", "note": "Peter Goldman (Davidson & Choy) | p.goldman@dcpublicity.com | 39 S. El Molino Ave, Pasadena | Hamid Rahmanian", "source": "NIA Database"}, {"month": "March", "date": "Mar 22", "title": "B2K Reunites — Boys 4 Life Tour", "category": "Music", "endDate": "", "note": "Tresa Sanders (TreMedia) | tresa@tre-media.net | Kia Forum, 3900 W. Manchester Blvd, Inglewood | B2K, Bow Wow, Jeremih", "source": "NIA Database"}, {"month": "March", "date": "Mar 22", "title": "Trees Lounge 30th Anniversary Screening", "category": "Film", "endDate": "", "note": "American Cinematheque | publicity@americancinematheque.com | Aero Theatre, 1328 Montana Ave, Santa Monica | Steve Buscemi", "source": "NIA Database"}, {"month": "March", "date": "Mar 23", "title": "Ain't Misbehavin' Opening Night", "category": "Entertainment", "endDate": "", "note": "Patty Onagan | patty@pattyonagan.com | Nate Holden PAC, 4718 W. Washington Blvd, LA | Ledisi, Chester Gregory", "source": "NIA Database"}, {"month": "March", "date": "Mar 24", "title": "Kim's Convenience — Ahmanson Theatre Opening", "category": "Entertainment", "endDate": "", "note": "CTG Media | ctgmedia@ctgla.org | Ahmanson Theatre, 135 N. Grand Ave, LA | Ins Choi — Netflix series inspiration", "source": "NIA Database"}, {"month": "March", "date": "Mar 27", "title": "Stand By Me Screening — Cast Event", "category": "Film", "endDate": "", "note": "Sheila (Right On! PR) | sheila@rightonpr.com | City National Grove of Anaheim | Corey Feldman, Jerry O'Connell, Wil Wheaton", "source": "NIA Database"}, {"month": "March", "date": "Mar 28", "title": "45th College Television Awards", "category": "Entertainment", "endDate": "", "note": "Jane (Break White Light) | jane@breakwhitelight.com | Saban Media Center, 5210 Lankershim, North Hollywood | Rhenzy Feliz", "source": "NIA Database"}, {"month": "March", "date": "Mar 30", "title": "Brandy Walk of Fame Star Ceremony", "category": "Entertainment", "endDate": "", "note": "Ana Martinez (Hollywood Chamber) | ana@hollywoodchamber.net | Hollywood Walk of Fame, 6201 Hollywood Blvd | Brandy, Issa Rae, Babyface", "source": "NIA Database"}, {"month": "March", "date": "Mar 31", "title": "Red Rocket Special Screening", "category": "Film", "endDate": "", "note": "LAFCA / Netflix | lafca@mprm.com | Egyptian Theatre, Hollywood | Sean Baker, Simon Rex — 35mm", "source": "NIA Database"}, {"month": "March", "date": "Mar 31", "title": "The Snappys Awards Show", "category": "Tech", "endDate": "", "note": "Snap Inc. | press@snap.com | Snap Inc., 2772 Donald Douglas Loop N, Santa Monica | DJ Khaled, Matt Friend", "source": "NIA Database"}, {"month": "April", "date": "Apr 1", "title": "Robert Glasper Residency — Blue Note LA", "category": "Music", "endDate": "", "note": "Blue Note LA | 6374 Sunset Blvd, LA | bluenotejazz.com/la/contact", "source": "NIA Database"}, {"month": "April", "date": "Apr 2", "title": "Arlo Parks Album Listening Party", "category": "Music", "endDate": "", "note": "Amoeba Music | 6200 Hollywood Blvd, Hollywood | Early album listen + sales event", "source": "NIA Database"}, {"month": "April", "date": "Apr 3", "title": "DAVE Concert — Album Support", "category": "Music", "endDate": "", "note": "Live Nation | livenation.com/pressrequests | Hollywood Palladium, 6215 Sunset Blvd, Hollywood", "source": "NIA Database"}, {"month": "April", "date": "Apr 3", "title": "The Last Five Years Concert Staging", "category": "Entertainment", "endDate": "", "note": "Anna Loynes (Scoop/Solters) | aloynes@solters.com | Hollywood Bowl | Ben Platt, Rachel Zegler", "source": "NIA Database"}, {"month": "April", "date": "Apr 4", "title": "PaleyFest — Pluribus Finale Screening", "category": "Entertainment", "endDate": "", "note": "Teresa Brady (Paley Center) | tbrady@paleycenter.org | Dolby Theatre, 6801 Hollywood Blvd", "source": "NIA Database"}, {"month": "April", "date": "Apr 4", "title": "English — Pulitzer Play Opening (The Wallis)", "category": "Entertainment", "endDate": "", "note": "Victoria Westbrook (DC Publicity) | v.westbrook@dcpublicity.com | The Wallis, 9390 N. Santa Monica Blvd, BH | Sanaz Toossi", "source": "NIA Database"}, {"month": "April", "date": "Apr 4", "title": "LANY — Soft World Tour", "category": "Music", "endDate": "", "note": "Kaeleah Isaac (The Oriel) | kaeleah@theoriel.co | Intuit Dome, 3930 W. Century Blvd, Inglewood", "source": "NIA Database"}, {"month": "April", "date": "Apr 6", "title": "PaleyFest — Charlie's Angels 50th Anniversary", "category": "Entertainment", "endDate": "", "note": "Teresa Brady | tbrady@paleycenter.org | Dolby Theatre | Kate Jackson, Jaclyn Smith, Cheryl Ladd", "source": "NIA Database"}, {"month": "April", "date": "Apr 6", "title": "LEGENDS Comedy Show", "category": "Entertainment", "endDate": "", "note": "Hollywood Improv | hollywood@improv.com | 8162 Melrose Ave, Hollywood | Jay Leno, Damon Wayans, Larry Wilmore", "source": "NIA Database"}, {"month": "April", "date": "Apr 7", "title": "PaleyFest — Shrinking Finale", "category": "Entertainment", "endDate": "", "note": "Teresa Brady | tbrady@paleycenter.org | Dolby Theatre | Bill Lawrence, Brett Goldstein, Jason Segel, Harrison Ford", "source": "NIA Database"}, {"month": "April", "date": "Apr 7", "title": "Bruce Springsteen & E Street Band", "category": "Music", "endDate": "", "note": "Anna Loynes (Solters) | aloynes@solters.com | Kia Forum, 3900 W. Manchester Blvd, Inglewood", "source": "NIA Database"}, {"month": "April", "date": "Apr 7", "title": "Disclosure — Spring 2026 North America Tour", "category": "Music", "endDate": "", "note": "Lisa DiAngelo (Interscope/Capitol) | Lisa.DiAngelo@umusic.com | Santa Barbara Bowl, kickoff", "source": "NIA Database"}, {"month": "April", "date": "Apr 8", "title": "BEEF S2 World Premiere", "category": "Film", "endDate": "", "note": "Julia Rossen (APEX PR) | julia@theapex-pr.com | Egyptian Theatre, Hollywood | Oscar Isaac, Carey Mulligan, Charles Melton", "source": "NIA Database"}, {"month": "April", "date": "Apr 8", "title": "Trail Blazers Ball — Environmental Leadership Gala", "category": "Entertainment", "endDate": "", "note": "Jennifer Price (The Lippin Group) | jprice@lippingroup.com | Skirball Cultural Center | Nancy Pelosi, Morgan Freeman, Ted Turner", "source": "NIA Database"}, {"month": "April", "date": "Apr 8", "title": "PaleyFest — Nobody Wants This", "category": "Entertainment", "endDate": "", "note": "Teresa Brady | tbrady@paleycenter.org | Dolby Theatre | Kristen Bell, Adam Brody, Erin Foster", "source": "NIA Database"}, {"month": "April", "date": "Apr 9", "title": "Colleagues Spring Luncheon & Oscar de la Renta Fashion Show", "category": "Fashion", "endDate": "", "note": "Ann Gurrola (Marleah Leslie) | ann@marleahleslie.com | Beverly Wilshire 4 Seasons | Luc Robitaille, Kate Flannery", "source": "NIA Database"}, {"month": "April", "date": "Apr 9", "title": "Global Gaming League Championship", "category": "Entertainment", "endDate": "", "note": "Owen (Thought Gang Media) | owen@thoughtgangmedia.com | WePlay Studios, 235 Florence Ave, Inglewood | NE-YO, Howie Mandel, Kardinal Offishall", "source": "NIA Database"}, {"month": "April", "date": "Apr 10", "title": "Coachella Valley Music & Arts Festival (Weekend 1)", "category": "Music", "endDate": "Apr 12", "note": "press@coachella.com | Empire Polo Field, 81800 51st Ave, Indio | Justin Bieber, Sabrina Carpenter, Karol G", "source": "NIA Database"}, {"month": "April", "date": "Apr 10", "title": "Beverly Hills Theater — Kirk Douglas", "category": "Entertainment", "endDate": "", "note": "CTGmedia@ctgla.org | Kirk Douglas Theater, 9820 Washington Blvd, Culver City | Nathan Fillion, Dulé Hill, Lamorne Morris", "source": "NIA Database"}, {"month": "April", "date": "Apr 10", "title": "PaleyFest — Emily in Paris", "category": "Entertainment", "endDate": "", "note": "Teresa Brady | tbrady@paleycenter.org | Dolby Theatre, Hollywood", "source": "NIA Database"}, {"month": "April", "date": "Apr 11", "title": "Sonic Desert — Coachella Brand Experience", "category": "Entertainment", "endDate": "", "note": "Style Firm | hello@style-firm.com | Private Ranch, Thermal CA (RSVP only) | Lizzo, Charlie D'Amelio, Dominic Fike", "source": "NIA Database"}, {"month": "April", "date": "Apr 11", "title": "PaleyFest — Scrubs / Your Friends & Neighbors", "category": "Entertainment", "endDate": "", "note": "Teresa Brady | tbrady@paleycenter.org | Dolby Theatre", "source": "NIA Database"}, {"month": "April", "date": "Apr 11", "title": "We Them One's Comedy Tour", "category": "Entertainment", "endDate": "", "note": "BMN Entertainment | press@blitzmediaevents.com | Intuit Dome, Inglewood | Mike Epps, Tony Roberts", "source": "NIA Database"}, {"month": "April", "date": "Apr 12", "title": "PaleyFest Finale — The Pitt", "category": "Entertainment", "endDate": "", "note": "Teresa Brady | tbrady@paleycenter.org | Dolby Theatre | Noah Wyle, Katherine LaNasa, Shawn Hatosy", "source": "NIA Database"}, {"month": "April", "date": "Apr 12", "title": "Beverly Hills Film Festival", "category": "Film", "endDate": "Apr 19", "note": "info@beverlyhillsfilmfestival.com | TCL Chinese Theatre, 6925 Hollywood Blvd, Hollywood", "source": "NIA Database"}, {"month": "April", "date": "Apr 13", "title": "CinemaCon 2026", "category": "Film", "endDate": "Apr 16", "note": "cinemaconpress@cinemaunited.org | Caesars Palace, 3570 Las Vegas Blvd S, Las Vegas | Cinema industry convention", "source": "NIA Database"}, {"month": "April", "date": "Apr 14", "title": "D23: The Ultimate Disney Fan Event", "category": "Entertainment", "endDate": "", "note": "TWDC.pressinquiries@Disney.com | Anaheim Convention Center, 800 W. Katella Ave", "source": "NIA Database"}, {"month": "April", "date": "Apr 14", "title": "Fashion Los Angeles Awards", "category": "Fashion", "endDate": "", "note": "Andy Gelb / Julia Rossen (APEX PR) | andy@theapex-pr.com | Beverly Hills | Tiffany Haddish", "source": "NIA Database"}, {"month": "April", "date": "Apr 14", "title": "Music Sustainability Summit & Awards", "category": "Music", "endDate": "", "note": "Jennifer Gross (EMG PR) | jennifer@emgpr.com | Solotech Studios, 1017 N. Las Palmas Ave, LA | Music Sustainability Alliance", "source": "NIA Database"}, {"month": "April", "date": "Apr 17", "title": "EmpowHer Institute — Female Mentor Opportunity", "category": "Awareness", "endDate": "", "note": "sheila@empowher.org | Teen summit seeking female mentors | Apply via email", "source": "NIA Database"}, {"month": "April", "date": "Apr 17", "title": "Tony Awards PR Kickoff", "category": "Entertainment", "endDate": "", "note": "APEX PR | TonyAwardsPR@theapex-pr.com | Broadway League / American Theatre Wing | June 7 main event", "source": "NIA Database"}, {"month": "April", "date": "Apr 18", "title": "NAB Show 2026", "category": "Tech", "endDate": "Apr 22", "note": "mraymond@nab.org | Las Vegas Convention Center | Broadcast, media, entertainment technology", "source": "NIA Database"}, {"month": "April", "date": "Apr 18", "title": "AFI Life Achievement Award — Eddie Murphy", "category": "Film", "endDate": "", "note": "Shari Mesulam | shari@themesulamgroup.com | Hollywood | Annual AFI tribute", "source": "NIA Database"}, {"month": "April", "date": "Apr 19", "title": "Elton John — The Remixes (Record Store Day Release)", "category": "Music", "endDate": "", "note": "Meg McLean Corso (UMG) | meg.mcleancorso@umusic.com | Amokhtar@2pmsharp.com", "source": "NIA Database"}, {"month": "April", "date": "Apr 23", "title": "ReelAbilities Film Festival", "category": "Film", "endDate": "Apr 30", "note": "press@reelabilities.org | New York City | Disabilities-focused film festival", "source": "NIA Database"}, {"month": "April", "date": "Apr 25", "title": "MEHA Celebrity Invitational Golf Tournament", "category": "Sports", "endDate": "", "note": "prstarus2000@yahoo.com | Seeking celebrity golfers — talent opportunity", "source": "NIA Database"}, {"month": "April", "date": "Apr 28", "title": "Academy Scientific and Technical Awards", "category": "Film", "endDate": "", "note": "publicity@oscars.org | Academy Museum of Motion Pictures, Los Angeles", "source": "NIA Database"}, {"month": "May", "date": "May 25", "title": "American Music Awards 2026", "category": "Music", "endDate": "", "note": "APEX/Dick Clark/CBS/Paramount | AMAs@theapex-pr.com | Las Vegas", "source": "NIA Database"}, {"month": "May", "date": "May 26", "title": "Los Angeles Greek Film Festival", "category": "Film", "endDate": "May 31", "note": "Melinda Manos | melinda@manospr.com | Los Angeles", "source": "NIA Database"}, {"month": "June", "date": "Jun 3", "title": "Tribeca Film Festival", "category": "Film", "endDate": "Jun 14", "note": "festivalpress@tribecafilm.com | New York City", "source": "NIA Database"}, {"month": "June", "date": "Jun 7", "title": "Tony Awards 2026", "category": "Entertainment", "endDate": "", "note": "APEX PR | TonyAwardsPR@theapex-pr.com | Broadway League / American Theatre Wing", "source": "NIA Database"}, {"month": "June", "date": "Jun 17", "title": "Nantucket Film Festival", "category": "Film", "endDate": "Jun 22", "note": "Stephanie (Frank Publicity) | stephanie@frankpublicity.com | Nantucket", "source": "NIA Database"}, {"month": "September", "date": "Sep 14", "title": "Emmy Awards 2026", "category": "Entertainment", "endDate": "", "note": "Break White Light | stephanie@breakwhitelight.com | Television Academy | NBC broadcast", "source": "NIA Database"}, {"month": "October", "date": "Oct 21", "title": "AFI Fest 2026", "category": "Film", "endDate": "Oct 25", "note": "Shari Mesulam | shari@themesulamgroup.com | Hollywood", "source": "NIA Database"}];

const VENUES_DATA = [{"id": "01", "name": "Hollywood Bowl", "type": "Amphitheatre / Concert Venue", "address": "2301 N. Highland Avenue, Hollywood, CA 90068", "city": "Los Angeles, CA", "phone": "+1 (323) 850-2000", "site": "hollywoodbowl.com", "capacity": "17,500", "desc": "Iconic outdoor amphitheatre and home of the Los Angeles Philharmonic summer season. One of the most celebrated music venues in the world, hosting major concerts, festivals, and film nights.", "eventsHosted": "The Last Five Years Concert Staging (Apr 3, 2026)"}, {"id": "02", "name": "Intuit Dome", "type": "Arena", "address": "3930 W. Century Blvd., Inglewood, CA 90304", "city": "Inglewood, CA", "phone": "+1 (213) 742-7100", "site": "intuitdome.com", "capacity": "18,000", "desc": "State-of-the-art arena opened 2024, home of the LA Clippers. Purpose-built for entertainment with cutting-edge technology and immersive fan experiences. DR contacts: D. Rogers + G. Corrigan (Clippers).", "eventsHosted": "LANY Soft World Tour (Apr 4); DINASTÍA Tour; We Them One's Comedy Tour"}, {"id": "03", "name": "SoFi Stadium / Hollywood Park", "type": "Stadium / Entertainment Complex", "address": "1001 S. Stadium Drive, Inglewood, CA 90301", "city": "Inglewood, CA", "phone": "+1 (833) 463-7634", "site": "hollywoodparkca.com", "capacity": "70,000", "desc": "Home of the LA Rams and LA Chargers, SoFi Stadium is part of the Hollywood Park entertainment district. Hosts major concerts, comedy shows, and live events alongside NFL games.", "eventsHosted": "Gabriel Iglesias & Jo Koy: One Night Only; Monster Jam; We Them One's Comedy Tour"}, {"id": "04", "name": "Kia Forum", "type": "Arena", "address": "3900 W. Manchester Blvd., Inglewood, CA 90305", "city": "Inglewood, CA", "phone": "+1 (310) 330-7300", "site": "theforum.com", "capacity": "17,500", "desc": "Legendary arena in Inglewood, venue for major concerts and sporting events. Formerly known as The Forum (home of the Showtime Lakers). One of LA's premier indoor entertainment venues.", "eventsHosted": "B2K Reunites Boys 4 Life Tour (Mar 22); Bruce Springsteen & E Street Band (Apr 7)"}, {"id": "05", "name": "Hollywood Palladium", "type": "Concert Hall", "address": "6215 Sunset Blvd., Hollywood, CA 90028", "city": "Los Angeles, CA", "phone": "+1 (323) 962-7600", "site": "livenation.com", "capacity": "3,500", "desc": "Historic 1940s Hollywood ballroom and concert venue on Sunset Blvd. One of LA's most storied live music spaces, known for intimate mid-size shows.", "eventsHosted": "DAVE Concert (Apr 3, 2026)"}, {"id": "06", "name": "The Fonda Theatre", "type": "Concert Venue", "address": "6126 Hollywood Blvd., Hollywood, CA 90028", "city": "Los Angeles, CA", "phone": "+1 (323) 464-6269", "site": "fondatheatre.com", "capacity": "1,300", "desc": "Intimate Hollywood concert venue with a rich history. Known for its excellent acoustics and close-quarters standing room layout, popular for mid-level touring acts.", "eventsHosted": "Amber Mark — The Pretty Idea Tour (Mar 20, 2026)"}, {"id": "07", "name": "Catalina Jazz Club", "type": "Jazz Club / Restaurant", "address": "6725 W. Sunset Blvd., Hollywood, CA 90028", "city": "Los Angeles, CA", "phone": "+1 (323) 466-2210", "site": "catalinajazzclub.com", "capacity": "250", "desc": "Intimate jazz supper club on Sunset Blvd, one of LA's last dedicated jazz venues. Features world-class performers nightly with dinner service. DR PR contact via Sharp Associates PR.", "eventsHosted": "Ron Carter Birthday (Mar 19); Jane Monheit (Apr 3); Norwood Young (Apr 5); Cuban Jam Sessions (Apr 9)"}, {"id": "08", "name": "Largo at the Coronet", "type": "Intimate Performance Venue", "address": "366 N. La Cienega Blvd., Los Angeles, CA 90048", "city": "Los Angeles, CA", "phone": "+1 (310) 855-0350", "site": "largo-la.com", "capacity": "275", "desc": "Beloved Los Angeles performance space known for intimate comedy, music, and spoken word events. Frequented by industry insiders. Home to residencies by top comedians and musicians.", "eventsHosted": "Inara George Album Release Benefit (Mar 20); Sara Silverman and Friends (Mar 30); Marc Maron & Friends (Apr 7)"}, {"id": "09", "name": "Blue Note Los Angeles", "type": "Jazz Club", "address": "6374 Sunset Blvd., Los Angeles, CA 90028", "city": "Los Angeles, CA", "phone": "+1 (323) 469-2583", "site": "bluenotejazz.com/la", "capacity": "150", "desc": "LA outpost of the legendary New York jazz institution. Intimate venue on Sunset Strip for jazz residencies, live recordings, and premium performances.", "eventsHosted": "Robert Glasper Residency (Apr 1, 2026)"}, {"id": "10", "name": "Vibrato Grill Jazz", "type": "Jazz Club / Fine Dining", "address": "2930 N. Beverly Glen Circle, Bel Air, CA 90077", "city": "Bel Air, CA", "phone": "+1 (310) 474-9400", "site": "vibratogrilljazz.com", "capacity": "200", "desc": "Intimate Bel Air jazz club and fine dining restaurant founded by Herb Alpert. Upscale setting with top-tier jazz performers and an excellent food menu.", "eventsHosted": "Pete Escovedo featuring Juan & Peter Michael Escovedo (Apr 8, 2026)"}, {"id": "11", "name": "Hollywood Improv", "type": "Comedy Club", "address": "8162 Melrose Ave., Los Angeles, CA 90046", "city": "Los Angeles, CA", "phone": "+1 (323) 651-2583", "site": "improv.com/hollywood", "capacity": "400", "desc": "Original Improv comedy club on Melrose, a legendary institution in stand-up comedy. Launch pad for major comedians. Part of the Improv Comedy Clubs chain.", "eventsHosted": "LEGENDS Comedy Show — Jay Leno, Damon Wayans, Larry Wilmore (Apr 6, 2026)"}, {"id": "12", "name": "Egyptian Theatre", "type": "Historic Cinema / Screening Venue", "address": "6712 Hollywood Blvd., Hollywood, CA 90028", "city": "Los Angeles, CA", "phone": "+1 (323) 461-2020", "site": "americancinematheque.com", "capacity": "616", "desc": "One of Hollywood's most storied historic cinemas, built in 1922. Now operated by the American Cinematheque, it hosts premieres, special screenings, and retrospectives. Press via American Cinematheque.", "eventsHosted": "BEEF S2 World Premiere; Something Very Bad Is Going to Happen; Sopranos 25th; Red Rocket; Faces of Death"}, {"id": "13", "name": "Dolby Theatre", "type": "Entertainment Venue", "address": "6801 Hollywood Blvd., Hollywood, CA 90028", "city": "Los Angeles, CA", "phone": "+1 (323) 308-6300", "site": "dolbytheatre.com", "capacity": "3,332", "desc": "Home of the Academy Awards since 2002, and host of PaleyFest, major theatrical productions, and award ceremonies. One of the most recognisable entertainment venues in the world.", "eventsHosted": "PaleyFest 2026 (Pluribus, Charlie's Angels, Shrinking, Nobody Wants This, Emily in Paris, Scrubs, The Pitt)"}, {"id": "14", "name": "Academy Museum of Motion Pictures", "type": "Museum / Screening Venue", "address": "6067 Wilshire Blvd. at Fairfax Ave., Los Angeles, CA 90036", "city": "Los Angeles, CA", "phone": "+1 (323) 930-3000", "site": "academymuseum.org", "capacity": "Varies (David Geffen Theater: 1,000)", "desc": "The world's premier museum dedicated to the art and science of movies. Features two screenings spaces — the David Geffen Theater and the Ted Mann Theater. Press via Academy Museum press team.", "eventsHosted": "The English Patient in 35mm; Inside JAWS; Follow That Bird; Welcome II the Terrordome; Academy Sci-Tech Awards"}, {"id": "15", "name": "Ahmanson Theatre / Center Theatre Group", "type": "Theatre", "address": "135 N. Grand Ave., Los Angeles, CA 90012", "city": "Los Angeles, CA", "phone": "+1 (213) 628-2772", "site": "centertheatregroup.org", "capacity": "2,100", "desc": "LA's premier large-scale theatre, part of the Music Center. Home to major Broadway productions and world premieres. CTG operates Ahmanson, Mark Taper Forum, and Kirk Douglas Theater.", "eventsHosted": "Kim's Convenience — inspired Netflix series (Mar 24, 2026)"}, {"id": "16", "name": "Kirk Douglas Theater", "type": "Theatre", "address": "9820 Washington Blvd., Culver City, CA 90232", "city": "Culver City, CA", "phone": "+1 (213) 628-2772", "site": "centertheatregroup.org", "capacity": "317", "desc": "Intimate 317-seat theatre in Culver City operated by Center Theatre Group. Known for world premieres and innovative productions. Part of the CTG family with Ahmanson and Mark Taper Forum.", "eventsHosted": "Beverly Hills play (Apr 10, 2026) — Nathan Fillion, Dulé Hill, Lamorne Morris"}, {"id": "17", "name": "REDCAT / Roy and Edna Disney/CalArts Theater", "type": "Experimental Theatre", "address": "631 West Second Street at Hope, Downtown Los Angeles, CA 90012", "city": "Los Angeles, CA", "phone": "+1 (213) 237-2800", "site": "redcat.org", "capacity": "250", "desc": "Innovative multi-disciplinary arts venue inside Walt Disney Concert Hall. Presents boundary-pushing theatre, dance, film, and visual art — operated by CalArts.", "eventsHosted": "Sad Boys in Harpy Land — Alex Tatarsky, West Coast premiere (Mar 19, 2026)"}, {"id": "18", "name": "Aero Theatre", "type": "Historic Cinema", "address": "1328 Montana Avenue, Santa Monica, CA 90403", "city": "Santa Monica, CA", "phone": "+1 (310) 260-1528", "site": "americancinematheque.com", "capacity": "265", "desc": "Charming 1940s neighbourhood cinema in Santa Monica, operated by the American Cinematheque. Known for curated repertory programming, Q&As, and retrospective screenings.", "eventsHosted": "Trees Lounge 30th Anniversary; YES/Policeman; Faces of Death Advance Screening"}, {"id": "19", "name": "Skirball Cultural Center", "type": "Cultural Centre / Event Venue", "address": "2701 N. Sepulveda Blvd., Los Angeles, CA 90049", "city": "Los Angeles, CA", "phone": "+1 (310) 440-4500", "site": "skirball.org", "capacity": "Varies (largest space: 500+)", "desc": "Major Jewish cultural institution and event venue in the Santa Monica Mountains. Hosts galas, exhibitions, performances, and community events in a stunning architectural setting.", "eventsHosted": "Trail Blazers Ball — Nancy Pelosi, Morgan Freeman, Ted Turner, Dolores Huerta (Apr 8, 2026)"}, {"id": "20", "name": "The Wallis Annenberg Center for the Performing Arts", "type": "Performing Arts Centre", "address": "9390 N. Santa Monica Blvd., Beverly Hills, CA 90210", "city": "Beverly Hills, CA", "phone": "+1 (310) 746-4000", "site": "thewallis.org", "capacity": "500", "desc": "Premier performing arts venue in Beverly Hills presenting theatre, dance, music, and film. A landmark cultural institution in the heart of Beverly Hills.", "eventsHosted": "English — Pulitzer Prize-winning play by Sanaz Toossi (Apr 4, 2026)"}, {"id": "21", "name": "Pasadena Playhouse", "type": "Theatre", "address": "39 S. El Molino Avenue, Pasadena, CA 91101", "city": "Pasadena, CA", "phone": "+1 (626) 356-7529", "site": "pasadenaplayhouse.org", "capacity": "686", "desc": "California State Theater, one of the country's oldest and most celebrated theatres. Presents world premieres and regional productions with strong casting.", "eventsHosted": "Song of the North — Hamid Rahmanian (Mar 21, 2026)"}, {"id": "22", "name": "Nate Holden Performing Arts Center", "type": "Theatre", "address": "4718 West Washington Boulevard, Los Angeles, CA 90016", "city": "Los Angeles, CA", "phone": "+1 (323) 964-9766", "site": "natehold.org", "capacity": "99", "desc": "Intimate Black-owned and community-anchored theatre on the Westside of LA. Known for productions celebrating African-American stories and talent.", "eventsHosted": "Ain't Misbehavin' — Ledisi, Chester Gregory (Mar 23, 2026)"}, {"id": "23", "name": "Petersen Automotive Museum", "type": "Museum / Event Venue", "address": "6060 Wilshire Blvd., Los Angeles, CA 90036", "city": "Los Angeles, CA", "phone": "+1 (323) 930-2277", "site": "petersen.org", "capacity": "Varies", "desc": "World-class automotive museum on the Miracle Mile with extraordinary event spaces. Hosts industry events, screenings, and celebrations with stunning car displays as backdrop.", "eventsHosted": "Petersen Breakfast Club Cruise-In — Jeff Dunham (Apr 12, 2026)"}, {"id": "24", "name": "Los Angeles State Historic Park", "type": "Public Park / Outdoor Venue", "address": "1245 N. Spring Street, Downtown Los Angeles, CA 90012", "city": "Los Angeles, CA", "phone": "+1 (213) 221-9944", "site": "parks.ca.gov", "capacity": "Up to 65,000 (open air)", "desc": "32-acre park on the LA River near Chinatown, used for large-scale outdoor festivals, concerts, and community events. Views of the Downtown skyline.", "eventsHosted": "Bob Baker Day festival — April 12, 2026"}, {"id": "25", "name": "WePlay Studios", "type": "eSports / Event Studios", "address": "235 Florence Avenue, Inglewood, CA 90301", "city": "Inglewood, CA", "phone": "", "site": "weplay.tv", "capacity": "2,000", "desc": "Purpose-built eSports and live event production studio near SoFi Stadium. Used for gaming championships, live broadcasts, and celebrity events.", "eventsHosted": "Global Gaming League Championship — NE-YO, Howie Mandel, Kardinal Offishall (Apr 9, 2026)"}, {"id": "26", "name": "Beverly Wilshire, A Four Seasons Hotel", "type": "Hotel / Event Venue", "address": "9500 Wilshire Blvd., Beverly Hills, CA 90212", "city": "Beverly Hills, CA", "phone": "+1 (310) 275-5200", "site": "fourseasons.com/beverlywilshire", "capacity": "Varies (Grand Ballroom: 1,000+)", "desc": "Iconic Beverly Hills luxury hotel and event venue. Host to major galas, luncheons, and awards events. The setting for Pretty Woman and countless Hollywood milestones.", "eventsHosted": "Colleagues Spring Luncheon & Oscar de la Renta Fashion Show (Apr 9); Champions for Children Gala"}, {"id": "27", "name": "Acrisure Arena", "type": "Arena", "address": "75702 Varner Road, Thousand Palms, CA 92276", "city": "Thousand Palms, CA", "phone": "+1 (442) 222-1000", "site": "acrisurearena.com", "capacity": "11,000", "desc": "Premier arena in the Coachella Valley, opened 2022. Home of the Firebirds hockey team, and the region's largest indoor concert venue — gateway for major touring acts to the desert market.", "eventsHosted": "DINASTÍA Tour — Peso Pluma, Tito Double P (Mar 17, 2026)"}, {"id": "28", "name": "Empire Polo Club / Coachella", "type": "Festival Grounds", "address": "81800 51st Avenue, Indio, CA 92201", "city": "Indio, CA", "phone": "", "site": "coachella.com", "capacity": "125,000/day", "desc": "Home of the Coachella Valley Music and Arts Festival, one of the world's most influential music and culture events. Annual April weekends draw global artists, brands, and media.", "eventsHosted": "Coachella 2026 — Weekend 1 (Apr 10-12); Weekend 2 (Apr 17-19). Justin Bieber, Sabrina Carpenter, Karol G, Anyma"}, {"id": "29", "name": "The Langham Huntington, Pasadena", "type": "Luxury Hotel / Event Venue", "address": "1401 S. Oak Knoll Avenue, Pasadena, CA 91106", "city": "Pasadena, CA", "phone": "+1 (626) 568-3900", "site": "langhamhotels.com/en/the-langham/pasadena", "capacity": "Varies", "desc": "Historic luxury resort hotel in Pasadena with grand event spaces and lush gardens. A go-to venue for high-profile retreats, luncheons, and galas.", "eventsHosted": "Femme 2026 Power Confab Retreat — Michelle Kwan, Soledad O'Brien (Mar 18, 2026)"}, {"id": "30", "name": "TCL Chinese Theatre", "type": "Historic Cinema / Event Venue", "address": "6925 Hollywood Blvd., Hollywood, CA 90028", "city": "Los Angeles, CA", "phone": "+1 (323) 461-3331", "site": "tclchinesetheatres.com", "capacity": "932", "desc": "One of the most recognisable buildings in the world. The TCL Chinese Theatre has been the site of Hollywood premieres since 1927. Famous for its celebrity handprints and footprints in the forecourt.", "eventsHosted": "Beverly Hills Film Festival — TCL Chinese Theatre (Apr 13-19, 2026)"}, {"id": "31", "name": "Beverly Hilton", "type": "Hotel / Event Venue", "address": "9876 Wilshire Blvd., Beverly Hills, CA 90210", "city": "Beverly Hills, CA", "phone": "+1 (310) 274-7777", "site": "beverlyhilton.com", "capacity": "Varies (International Ballroom: 1,500+)", "desc": "Iconic Beverly Hills hotel, home of the Golden Globes and numerous major industry events. One of the most storied event venues in Hollywood.", "eventsHosted": "TruthAwards — Black LGBTQ+ Leadership (Mar 21, 2026)"}, {"id": "32", "name": "Amoeba Music Hollywood", "type": "Record Store / Event Space", "address": "6200 Hollywood Blvd., Hollywood, CA 90028", "city": "Los Angeles, CA", "phone": "+1 (323) 245-6400", "site": "amoeba.com", "capacity": "500", "desc": "The world's largest independent record store. Hosts in-store performances, album listening parties, and signings — a beloved LA cultural institution for music fans and industry alike.", "eventsHosted": "Arlo Parks Album Listening Party (Apr 2, 2026)"}, {"id": "33", "name": "W Hotel Times Square", "type": "Hotel / Event Venue", "address": "1567 Broadway, New York, NY 10036", "city": "New York, NY", "phone": "+1 (212) 930-7400", "site": "marriott.com/en-us/hotels/nycwt", "capacity": "Varies", "desc": "Centrally located hotel in the heart of Times Square. Used for fashion week press events, brand activations, and media kickoff events. NYFW SS26 CLD PR Kickoff venue.", "eventsHosted": "CLD PR NYFW SS26 Kickoff Event — Fri Sep 12, 2025, 9am–4pm"}, {"id": "34", "name": "Spring Studios", "type": "Creative Studios / Event Venue", "address": "50 Varick St., 5th Floor, New York, NY 10013", "city": "New York, NY", "phone": "+1 (212) 965-1850", "site": "springstudios.com", "capacity": "Varies", "desc": "Major creative hub in Tribeca, home to NYFW shows, brand activations, and editorial shoots. One of NYC's most versatile multi-floor event and production spaces.", "eventsHosted": "Sergio Hudson SS26 Spring/Summer Runway Show — Fri Sep 12, 2025, 7pm"}, {"id": "35", "name": "The Frick Collection", "type": "Museum / Private Event Venue", "address": "1 East 70th Street, New York, NY 10021", "city": "New York, NY", "phone": "+1 (212) 288-0700", "site": "frick.org", "capacity": "Limited (private events)", "desc": "One of New York's greatest art museums, housed in the Gilded Age mansion of industrialist Henry Clay Frick. Hosts exclusive, invitation-only private events.", "eventsHosted": "Jessica McCormack x Zoë Kravitz celebration — Wed Sep 10, 2025, 7pm"}, {"id": "36", "name": "Brooklyn Chophouse", "type": "Restaurant / Private Dining", "address": "253 W. 47th Street, New York, NY 10036", "city": "New York, NY", "phone": "+1 (212) 944-4040", "site": "brooklynchophouse.com", "capacity": "Private dining available", "desc": "Upscale steakhouse and events space in Midtown Manhattan. Frequently used for fashion industry launch events, brand dinners, and media previews.", "eventsHosted": "Bibiré SS26 Spring/Summer Preview — Fri Sep 12, 2025, 7pm (True Blue PR)"}, {"id": "37", "name": "Sutton Tower", "type": "Residential Tower / Event Venue", "address": "430 East 58th Street, Penthouse 78, New York, NY 10022", "city": "New York, NY", "phone": "", "site": "suttontowernyc.com", "capacity": "Private events", "desc": "East Side's tallest waterfront residential tower with dramatic penthouse event spaces and panoramic views of the East River and Midtown skyline.", "eventsHosted": "Lanvin x GSH Contemporary AW25 debut collection preview — Wed Sep 10, 2025, 5–9pm"}, {"id": "38", "name": "WGACA Atelier", "type": "Vintage Fashion / Exhibition Space", "address": "113 Wooster Street, SoHo, New York, NY 10012", "city": "New York, NY", "phone": "+1 (212) 343-1100", "site": "wgacany.com", "capacity": "200", "desc": "What Goes Around Comes Around's flagship SoHo atelier for iconic vintage fashion. The space hosts exclusive archival installations and fashion events, including the Law Roach NYFW collaboration.", "eventsHosted": "WGACA x Law Roach — Exclusive Archival Fashion Installation, Thu Sep 11, 2025, 7–9pm"}, {"id": "39", "name": "The Glasshouses", "type": "Event Venue", "address": "545 West 25th Street, 21st Floor, New York, NY 10001", "city": "New York, NY", "phone": "+1 (212) 924-8888", "site": "theglasshouses.com", "capacity": "Varies (up to 600)", "desc": "Stunning glass-enclosed event venue in Chelsea with panoramic Hudson River views. One of NYC's premier rooftop and penthouse event spaces for fashion, media, and entertainment.", "eventsHosted": "WWD x FN x Beauty Inc Women in Power Annual Gala (4th edition) — Mon Sep 8, 2025"}, {"id": "40", "name": "50 Howard Street", "type": "Mixed-Use / Event Space", "address": "50 Howard Street, New York, NY 10013", "city": "New York, NY", "phone": "", "site": "purple-brand.com", "capacity": "Varies", "desc": "SoHo/Tribeca loft-style event space in Lower Manhattan. Versatile raw industrial space used for brand activations, fashion week events, and block parties.", "eventsHosted": "Purple Brand NYFW Block Party — Fri Sep 12, 2025, 5–9pm"}, {"id": "41", "name": "Chez Fifi", "type": "Restaurant / Private Events", "address": "140 East 74th Street, New York, NY 10021", "city": "New York, NY", "phone": "+1 (212) 879-4282", "site": "", "capacity": "Private dining", "desc": "Intimate upscale restaurant on the Upper East Side. Used by fashion houses and luxury brands for private cocktail events and brand dinners.", "eventsHosted": "Fendi Roma Spy Bag NYFW celebration hosted by Lauren Santo Domingo — Tue Sep 9, 2025, 7–9pm"}, {"id": "42", "name": "Ziegfeld Ballroom", "type": "Ballroom / Event Venue", "address": "141 W. 54th St., New York, NY 10019", "city": "New York, NY", "phone": "+1 (212) 455-0041", "site": "ziegfeldballroom.com", "capacity": "1,000", "desc": "Grand Midtown Manhattan ballroom used for galas, award ceremonies, and large-scale industry events. Features classic theatrical décor and a spacious main floor.", "eventsHosted": "The Legends Ball — International Tennis Hall of Fame annual gala during US Open (Sep 6, annual)"}, {"id": "43", "name": "101 Reade Street", "type": "Fashion Event Space / Studio", "address": "101 Reade Street, New York, NY 10013", "city": "New York, NY", "phone": "", "site": "publicserv-ce.com", "capacity": "Varies", "desc": "Tribeca event and showroom space used for designer runway presentations and collection previews. Located in Lower Manhattan's creative district.", "eventsHosted": "Public Serv-ce 'Street Tailorism' SS26 — Sun Sep 14, 2025, 5pm"}, {"id": "44", "name": "575 Madison Avenue", "type": "Office Tower / Showroom", "address": "575 Madison Avenue, 26th Floor, New York, NY 10022", "city": "New York, NY", "phone": "", "site": "", "capacity": "Showroom / presentation", "desc": "Midtown Manhattan office tower used for fashion showroom presentations and brand appointments during NYFW. Hikari no Yami SS26 presentation venue.", "eventsHosted": "Hikari no Yami SS26 Presentation — Fri Sep 12, 2025, 4:30–6:30pm. Under Armour footwear partnership."}, {"id": "45", "name": "Sohotel New York", "type": "Hotel / Event Venue", "address": "347 Broome Street, New York, NY 10013", "city": "New York, NY", "phone": "+1 (212) 226-1482", "site": "sohotelny.com", "capacity": "Varies", "desc": "Boutique hotel in the heart of SoHo, New York. Used for intimate industry events, gallery openings, and exhibition launches.", "eventsHosted": "NYFW: PASSÉ — Brad Walls solo US exhibition VIP opening, Thu Sep 11, 2025, 6–9pm"}, {"id": "46", "name": "Caesars Palace / CinemaCon", "type": "Hotel / Casino / Convention", "address": "3570 S. Las Vegas Blvd., Las Vegas, NV 89109", "city": "Las Vegas, NV", "phone": "+1 (702) 731-7110", "site": "caesarspalace.com", "capacity": "Varies (Colosseum: 4,300)", "desc": "Iconic Las Vegas resort and convention centre. Home of CinemaCon, the annual cinema industry convention. The Colosseum hosts major residencies and concerts.", "eventsHosted": "CinemaCon 2026 — April 13-16, 2026"}, {"id": "47", "name": "Venetian Theatre", "type": "Concert Theatre", "address": "3355 S. Las Vegas Blvd., Las Vegas, NV 89109", "city": "Las Vegas, NV", "phone": "+1 (702) 414-1000", "site": "venetianresort.com", "capacity": "1,815", "desc": "Intimate theatre at The Venetian Resort Las Vegas. Home to exclusive entertainment residencies and concert series.", "eventsHosted": "Boy George & Culture Club: Live in Las Vegas residency (Mar 18 ongoing)"}, {"id": "48", "name": "Agua Caliente Casino Resort Spa", "type": "Casino / Concert Venue", "address": "32-250 Bob Hope Drive, Rancho Mirage, CA 92270", "city": "Rancho Mirage, CA", "phone": "+1 (888) 999-1995", "site": "aguacalientecasinos.com", "capacity": "Varies", "desc": "Desert resort casino in Rancho Mirage with multiple entertainment venues. Hosts touring artists and residency performers in the Coachella Valley.", "eventsHosted": "Rick Springfield (Apr 4); Ron White (Apr 11, 2026) — Scoop Marketing / Solters"}];


/* ════════════════════════════════════════════════════════════════
   FUNCTIONS — Phase 2 build

   Functions help you create using a variety of data-driven, repeatable
   and reproducible processes, databases and models built for creative
   production work. Building blocks that ensure consistent creative
   output.

   Architecture:
     · FUNCTIONS_CATEGORIES — top-level categories (Intelligence is live;
       Agents and Models are scaffolded as SOON)
     · FUNCTIONS_INTELLIGENCE — the three Functions under Intelligence
       (Contacts, Events, Archetypes)
     · DBFunctionTutorial — first-use coachmark, persists dismissal in
       user.tutorialsSeen.functions
     · DBFunctionsBrowser — categories on the left, Functions on the right
     · DBContactsFunction — table / list / map views over 410 contacts
     · DBEventsFunction — calendar / list views over 275 events
     · Archetypes — reuses DBSkillsLibrary built in earlier turn

   Phase 3 will populate the Models category with five production-
   framework models (Content Production Guideline, Junket Brief, Budget,
   Schedule, Series Bible).
   ════════════════════════════════════════════════════════════════ */

const FUNCTIONS_CATEGORIES = [
  {
    id: 'intelligence',
    label: 'Intelligence',
    desc: 'Living databases the rest of Nia draws from',
    soon: false,
  },
  {
    id: 'models',
    label: 'Models',
    desc: 'Production frameworks turned into reusable templates',
    soon: false,                  // Phase 3 — live; gated by tier
    requiresTier: 'professional', // Foundation sees Pro pill on each card
  },
  {
    id: 'agents',
    label: 'Agents',
    desc: 'Long-running assistants that work on your behalf',
    soon: true,
  },
];

// Three live Functions under Intelligence
const FUNCTIONS_INTELLIGENCE = [
  {
    id: 'contacts',
    label: 'Contacts',
    desc: '410 media, PR, music, film, fashion contacts across 216 organizations',
    count: CONTACTS_DATA.length,
    countLabel: 'contacts',
    icon: 'users',
  },
  {
    id: 'events',
    label: 'Events',
    desc: '275 industry events, awards seasons, fashion weeks, and cultural moments in 2026',
    count: EVENTS_DATA.length,
    countLabel: 'events',
    icon: 'calendar',
  },
  {
    id: 'archetypes',
    label: 'Archetypes',
    desc: '282 creative production roles from the NRI Library — rates, tiers, descriptions',
    count: LIBRARY.length,
    countLabel: 'archetypes',
    icon: 'spark',
  },
];

/* ─── Models — FCC-faithful production framework templates ──────
   Five built-in templates derived from the canonical Function Creative
   Company TPL frameworks (TPL-01 through TPL-05). Each Model is an
   ordered sequence of typed sections.

   Section types:
     prose      — multi-line freeform paragraph
     list       — bulleted list (each row begins with —)
     fields     — labelled key/value table; section.fields = [{id,label,hint?}]
     grid       — repeating data table; section.columns = [{id,label,hint?}], section.targetRows
     checklist  — bulleted items with a checkbox state; section.items = string[] of suggested items
     repeating  — sub-schema repeated N times; section.sub = [{id,label,prompt,type,fields?}]
                  section.targetCount = suggested instance count

   When a user instantiates a Model, Claude is prompted with the schema
   and asked to return JSON with one key per section id. The shape of
   each value depends on the section's type:
     prose / list      → string
     fields            → object { fieldId: string, ... }
     grid              → array of objects [{ columnId: string, ... }]
     checklist         → array of objects [{ text: string, checked: boolean }]
     repeating         → array of objects, each shaped like a fields block

   Each Model also declares an optional `systemPrompt` that frames the
   AI's voice for the whole document.
   ────────────────────────────────────────────────────────────────── */
const MODELS = [
  {
    id: 'content-production',
    label: 'Content Production Guideline',
    desc: 'A framework for planning BTS, EPK, and promotional video shoots on episodic, film, and branded productions.',
    type: 'editorial',
    icon: 'file',
    fccCode: 'FCC / TPL-01',
    sections: [
      {
        id: 'project-summary',
        label: 'Project Summary',
        type: 'fields',
        prompt: 'Anchor every stakeholder in the same understanding of what is being made and why. Fill each field with project-specific information.',
        fields: [
          { id: 'projectTitle',       label: 'Project Title',       hint: 'The name of the production this content supports' },
          { id: 'client',             label: 'Client',              hint: 'The studio, broadcaster, distributor or brand commissioning the content' },
          { id: 'productionCompany',  label: 'Production Company',  hint: 'Your company name' },
          { id: 'contentType',        label: 'Content Type',        hint: 'BTS, EPK, PAV, social cutdowns, trailer assets — list all that apply' },
          { id: 'productionDates',    label: 'Production Dates',    hint: 'Every shoot day this brief covers' },
          { id: 'locations',          label: 'Locations',           hint: 'Cities, regions, or specific venues' },
          { id: 'languages',          label: 'Languages',           hint: 'Primary and secondary languages for interviews and on-camera content' },
          { id: 'briefAuthor',        label: 'Brief Author',        hint: 'Who is responsible for this document' },
          { id: 'lastUpdated',        label: 'Last Updated',        hint: 'Version date' },
        ],
      },
      {
        id: 'crew-contacts',
        label: 'Crew & Points of Contact',
        type: 'repeating',
        prompt: 'Identify everyone responsible for capturing, managing, or approving content on this project. Keep operational — full crew lists belong on the call sheet.',
        targetCount: 4,
        instanceLabel: 'Capture crew',
        sub: [
          { id: 'role',  label: 'Role',  type: 'prose' },
          { id: 'name',  label: 'Name',  type: 'prose' },
          { id: 'phone', label: 'Phone', type: 'prose' },
          { id: 'email', label: 'Email', type: 'prose' },
        ],
      },
      {
        id: 'approvals-escalation',
        label: 'Approvals & Escalation',
        type: 'fields',
        prompt: 'Define the four people who hold decision-making authority on this production.',
        fields: [
          { id: 'productionApprovals', label: 'Production approvals', hint: 'Producer with sign-off authority' },
          { id: 'clientApprovals',     label: 'Client approvals',     hint: 'Marketing or publicity contact at the client' },
          { id: 'onSetEscalation',     label: 'On-set escalation',    hint: 'Who to call when something needs a decision now' },
          { id: 'postProductionLead',  label: 'Post-production lead', hint: 'Editor or post supervisor receiving the rushes' },
        ],
      },
      {
        id: 'bts-coverage',
        label: 'Behind-the-Scenes Coverage',
        type: 'list',
        prompt: 'List the core moments, textures, and stories your BTS coverage needs to deliver. Each row starts with —. Cover candid cast moments, department spotlights, set context, process moments, bloopers, and any production-specific moments.',
      },
      {
        id: 'priority-bts-scenes',
        label: 'Priority Scenes for BTS Capture',
        type: 'grid',
        prompt: 'Reference the master shooting schedule. List scenes where BTS coverage is non-negotiable.',
        targetRows: 5,
        columns: [
          { id: 'scene',    label: 'Scene / Moment' },
          { id: 'date',     label: 'Shoot Date' },
          { id: 'location', label: 'Location' },
          { id: 'rationale',label: 'Why it matters' },
        ],
      },
      {
        id: 'epk-concepts',
        label: 'EPK Concepts',
        type: 'repeating',
        prompt: 'Each EPK concept gets its own brief block. A typical campaign runs 3-6 EPK concepts. Lock cast, questions, and capture environment well in advance.',
        targetCount: 3,
        instanceLabel: 'EPK Concept',
        sub: [
          { id: 'name',          label: 'Concept name',     type: 'prose' },
          { id: 'summary',       label: 'Concept summary',  type: 'prose' },
          { id: 'reference',     label: 'Reference',        type: 'prose' },
          { id: 'productionDay', label: 'Production day',   type: 'prose' },
          { id: 'location',      label: 'Location',         type: 'prose' },
          { id: 'mandatoryTalent', label: 'Mandatory talent', type: 'prose' },
          { id: 'optionalTalent',  label: 'Optional talent',  type: 'prose' },
          { id: 'questionSet',   label: 'Question set',     type: 'prose' },
          { id: 'deliverables',  label: 'Deliverables',     type: 'prose' },
        ],
      },
      {
        id: 'pav-concepts',
        label: 'Promotional Asset Video (PAV) Concepts',
        type: 'grid',
        prompt: 'Short-form, platform-native pieces designed to drive conversation before, during, and after launch. Sketch them here; finalise in a separate creative deck.',
        targetRows: 4,
        columns: [
          { id: 'concept',  label: 'Concept' },
          { id: 'platform', label: 'Platform & Format' },
          { id: 'talent',   label: 'Talent' },
          { id: 'shootDay', label: 'Shoot Day' },
          { id: 'status',   label: 'Status' },
        ],
      },
      {
        id: 'daily-checklist',
        label: 'Daily Operating Checklist',
        type: 'checklist',
        prompt: 'This checklist runs on every shoot day. Capture leads tick it off in the daily log. Surface problems before they become deliverable issues.',
        items: [
          'Full gear check against the equipment list',
          'Briefing with capture team on the day\'s priority moments',
          'Review the call sheet and confirm any schedule changes',
          'Confirm media cards are formatted and labelled',
          'Sync clocks and timecode across all cameras and audio',
          'Eat — capture days run long, food is non-negotiable',
          'Maintain a running technical camera log',
          'Flag any difficulty or talent issue to the producer in real time',
          'Back up media at every meal break, never only at wrap',
          'Full gear check at wrap — count it back into its case',
          'Compile the daily log and review the day\'s footage',
          'Organize content into delivery folder structure',
          'Generate proxies (max 720p) for the next-day review',
          'Upload daily-pick reels to the agreed shared folder',
        ],
      },
      {
        id: 'technical-delivery',
        label: 'Technical Delivery Standards',
        type: 'fields',
        prompt: 'Confirm every spec with the post-production lead and the client before the first shoot day. Spec drift is the most common cause of last-minute reshoots.',
        fields: [
          { id: 'masterCodec',     label: 'Master codec',         hint: 'ProRes 422 HQ, ProRes 4444, or client-specified standard' },
          { id: 'resolution',      label: 'Resolution',           hint: '4K, UHD, HD' },
          { id: 'frameRate',       label: 'Frame rate',           hint: 'Project-standard frame rate' },
          { id: 'audioSpec',       label: 'Audio specification',  hint: 'Channel layout, peak levels, sample rate' },
          { id: 'proxySpec',       label: 'Proxy specification',  hint: 'Codec and resolution for review proxies' },
          { id: 'naming',          label: 'Naming convention',    hint: 'Filename structure required by post' },
          { id: 'deliveryLocation',label: 'Delivery location',    hint: 'Cloud asset manager, hard drive, or shared folder URL' },
          { id: 'backupProtocol',  label: 'Backup protocol',      hint: 'Where the second copy lives and who is responsible' },
        ],
      },
      {
        id: 'folder-structure',
        label: 'Delivery Folder Structure',
        type: 'list',
        prompt: 'Standardize the folder structure before the first day of capture. List six top-level folders, each starting with —, in the FCC standard format: 01_EPK, 02_BTS_B-Roll, 03_PAV_Captures, 04_Stills, 05_Proxies_720p, 06_Daily_Logs.',
      },
      {
        id: 'approvals-signoff',
        label: 'Approvals & Sign-off',
        type: 'grid',
        prompt: 'This brief is locked once all named approvers have signed. Changes after sign-off are managed through written change-orders.',
        targetRows: 4,
        columns: [
          { id: 'role',      label: 'Role' },
          { id: 'name',      label: 'Name' },
          { id: 'date',      label: 'Date' },
          { id: 'signature', label: 'Signature / Initials' },
        ],
      },
    ],
    systemPrompt: 'You are filling a Function Creative Company Content Production Guideline. Be specific, practical, and production-realistic. No fluff, no jargon, no marketing voice.',
  },

  {
    id: 'junket-brief',
    label: 'Junket Brief',
    desc: 'A planning framework for press junkets, broadcast roundtables, and publicity-day shoots.',
    type: 'epk',
    icon: 'users',
    fccCode: 'FCC / TPL-02',
    sections: [
      {
        id: 'junket-overview',
        label: 'Junket Overview',
        type: 'fields',
        prompt: 'A junket is a high-density publicity day with tight scheduling, multiple press outlets, and limited talent windows. This is the source of truth — everyone walking into the venue should have read it.',
        fields: [
          { id: 'projectTitle', label: 'Project Title',  hint: 'The film, series or campaign being promoted' },
          { id: 'junketDate',   label: 'Junket Date',    hint: 'Day of the junket' },
          { id: 'setupDate',    label: 'Setup / Prep Date', hint: 'When the venue is dressed and tested' },
          { id: 'cityRegion',   label: 'City / Region',  hint: 'Junket location' },
          { id: 'junketType',   label: 'Junket Type',    hint: 'Broadcast, print, digital, hybrid' },
          { id: 'languages',    label: 'Languages',      hint: 'Primary and secondary languages required' },
          { id: 'briefAuthor',  label: 'Brief Author',   hint: 'Document owner' },
          { id: 'scheduleLink', label: 'Schedule Link',  hint: 'URL to the master run-of-day schedule' },
          { id: 'lastUpdated',  label: 'Last Updated',   hint: 'Version date' },
        ],
      },
      {
        id: 'venue-details',
        label: 'Venue Details',
        type: 'fields',
        prompt: 'Most junkets run multiple parallel rooms. Define the venue logistics so capture, comms, and venue ops are all aligned.',
        fields: [
          { id: 'venueName',    label: 'Venue name',     hint: 'Hotel, studio or location' },
          { id: 'address',      label: 'Address',        hint: 'Full address' },
          { id: 'venueContact', label: 'Venue contact',  hint: 'On-site coordinator with phone and email' },
          { id: 'loadIn',       label: 'Load-in time',   hint: 'When crew can access the venue' },
          { id: 'loadOut',      label: 'Load-out time',  hint: 'Hard-out for clearing the venue' },
          { id: 'parkingAccess',label: 'Parking & access', hint: 'Trucks, talent vehicles, press arrival' },
        ],
      },
      {
        id: 'room-allocation',
        label: 'Room Allocation',
        type: 'grid',
        prompt: 'Common allocation: two broadcast rooms for video interviews, one audio room for podcasts and remote calls, one staging or hold area for talent.',
        targetRows: 4,
        columns: [
          { id: 'room',          label: 'Room' },
          { id: 'purpose',       label: 'Purpose' },
          { id: 'sizeSqm',       label: 'Size (sqm)' },
          { id: 'ceilingHeight', label: 'Ceiling height' },
        ],
      },
      {
        id: 'talent-groupings',
        label: 'Talent Groupings & Pairings',
        type: 'grid',
        prompt: 'How talent is paired through the day shapes the entire run-of-show. Group by character relationships, story dynamics, or scheduling availability — write the rationale down so press can pitch the angles correctly.',
        targetRows: 5,
        columns: [
          { id: 'group',     label: 'Group' },
          { id: 'talent',    label: 'Talent' },
          { id: 'rationale', label: 'Rationale' },
          { id: 'languages', label: 'Languages' },
        ],
      },
      {
        id: 'talent-windows',
        label: 'Talent Windows',
        type: 'grid',
        prompt: 'Some talent will only be available for part of the day. List arrival and departure constraints so the schedule is built around them.',
        targetRows: 4,
        columns: [
          { id: 'talent',    label: 'Talent' },
          { id: 'arrival',   label: 'Arrival' },
          { id: 'departure', label: 'Departure' },
          { id: 'notes',     label: 'Notes' },
        ],
      },
      {
        id: 'capture-setup',
        label: 'Capture Setup by Room',
        type: 'repeating',
        prompt: 'Detail the camera, audio, and lighting package for each room. Crews reference this when load-in begins, so it must be specific.',
        targetCount: 3,
        instanceLabel: 'Room',
        sub: [
          { id: 'roomName',        label: 'Room name',         type: 'prose' },
          { id: 'cameraPackage',   label: 'Camera package',    type: 'prose' },
          { id: 'lightingPackage', label: 'Lighting package',  type: 'prose' },
          { id: 'audioPackage',    label: 'Audio package',     type: 'prose' },
          { id: 'gripSupport',     label: 'Grip / support',    type: 'prose' },
          { id: 'media',           label: 'Media',             type: 'prose' },
          { id: 'backdropBranding',label: 'Backdrop & branding', type: 'prose' },
        ],
      },
      {
        id: 'physical-deliverables',
        label: 'Printing & Physical Deliverables',
        type: 'grid',
        prompt: 'Title treatments, key art, and physical signage need to be produced and delivered to the venue with time for setup. This is the print spec sheet.',
        targetRows: 5,
        columns: [
          { id: 'item',         label: 'Item' },
          { id: 'specification',label: 'Specification' },
          { id: 'quantity',     label: 'Quantity' },
          { id: 'deliveryDate', label: 'Delivery date' },
        ],
      },
      {
        id: 'photography-setup',
        label: 'Photography Setup',
        type: 'fields',
        prompt: 'Photo coverage is often squeezed into the morning before interviews start. Plan it as a discrete block with its own setup, talent calls, and shot list.',
        fields: [
          { id: 'photographer', label: 'Photographer', hint: 'Name and contact' },
          { id: 'setupStyle',   label: 'Setup style',  hint: 'Express glam, formal portraits, environmental' },
          { id: 'location',     label: 'Location',     hint: 'Dedicated room or shared interview space' },
          { id: 'lighting',     label: 'Lighting',     hint: 'Strobe, continuous, available light' },
          { id: 'backdrop',     label: 'Backdrop',     hint: 'Colour, material, dimensions' },
        ],
      },
      {
        id: 'required-shots',
        label: 'Required Shots',
        type: 'checklist',
        prompt: 'The minimum photo coverage list. Add character pairings or ensemble configurations specific to this junket.',
        items: [
          'Solo of each cast member',
          'Solo of director and / or showrunner',
          'Group photo with director / showrunner',
          'Group photo without director / showrunner',
        ],
      },
      {
        id: 'special-concepts',
        label: 'Special Concept Segments',
        type: 'repeating',
        prompt: 'Branded content segments — themed games, partner integrations, talk-show formats, influencer-led pieces. Aim for two to four concepts maximum on a single junket day.',
        targetCount: 2,
        instanceLabel: 'Concept',
        sub: [
          { id: 'name',           label: 'Concept name',  type: 'prose' },
          { id: 'summary',        label: 'Concept summary', type: 'prose' },
          { id: 'format',         label: 'Format',        type: 'prose' },
          { id: 'host',           label: 'Host or guest interviewer', type: 'prose' },
          { id: 'talentRequired', label: 'Talent required', type: 'prose' },
          { id: 'reference',      label: 'Reference',     type: 'prose' },
          { id: 'propsWardrobe',  label: 'Props / wardrobe', type: 'prose' },
          { id: 'owner',          label: 'Owner',         type: 'prose' },
          { id: 'deliveryDate',   label: 'Delivery date', type: 'prose' },
        ],
      },
      {
        id: 'run-of-day',
        label: 'Run of Day',
        type: 'grid',
        prompt: 'Lock the high-level day shape. The detailed minute-by-minute schedule lives in a separate spreadsheet linked above; this is for the producer\'s wall.',
        targetRows: 8,
        columns: [
          { id: 'time',     label: 'Time' },
          { id: 'activity', label: 'Activity' },
          { id: 'talent',   label: 'Talent' },
          { id: 'room',     label: 'Room' },
        ],
      },
      {
        id: 'post-junket-delivery',
        label: 'Post-Junket Delivery',
        type: 'grid',
        prompt: 'Junket footage is time-sensitive — most assets need to land within 48 to 72 hours. Lock delivery against this schedule before the junket happens.',
        targetRows: 5,
        columns: [
          { id: 'asset',         label: 'Asset' },
          { id: 'specification', label: 'Specification' },
          { id: 'owner',         label: 'Owner' },
          { id: 'deadline',      label: 'Delivery deadline' },
        ],
      },
      {
        id: 'approvals-signoff',
        label: 'Approvals & Sign-off',
        type: 'grid',
        prompt: 'Document who signed off and when. Changes after sign-off are managed through written change-orders.',
        targetRows: 4,
        columns: [
          { id: 'role',      label: 'Role' },
          { id: 'name',      label: 'Name' },
          { id: 'date',      label: 'Date' },
          { id: 'signature', label: 'Signature / Initials' },
        ],
      },
    ],
    systemPrompt: 'You are filling a Function Creative Company Junket Brief. Be specific, professional, PR-realistic. Address the talent and PR team directly.',
  },

  {
    id: 'production-budget',
    label: 'Production Budgeting Framework',
    desc: 'A pricing methodology, tiered service model, and variable cost framework for production studios and creative agencies.',
    type: 'editorial',
    icon: 'card',
    fccCode: 'FCC / TPL-03',
    sections: [
      {
        id: 'operating-principles',
        label: 'Operating Principles',
        type: 'list',
        prompt: 'Four principles underpin this framework. Each row starts with —. Cover: data-driven pricing not intuition; invoiced price vs variable cost as the key relationship; planning for the worst case on variable costs; and the four variable cost categories (labor, equipment, materials, administrative).',
      },
      {
        id: 'sufficiency-figures',
        label: 'Working Assumptions',
        type: 'fields',
        prompt: 'Sufficiency is the minimum monthly revenue your studio needs to cover fixed costs and deliver target profit. Pricing below sufficiency means you\'re losing money on every project. Fill with this studio\'s actual data — the example uses 70% variable cost.',
        fields: [
          { id: 'variableCostPct', label: 'Variable cost as % of revenue', hint: 'Operational range — typically 50-70%' },
          { id: 'tmr',             label: 'Target Monthly Revenue (TMR)', hint: 'Revenue figure required to hit profit goals' },
          { id: 'fixedCosts',      label: 'Monthly fixed costs', hint: 'Rent, salaries, software, recurring services' },
          { id: 'profitExpectation', label: 'Monthly profit expectation', hint: 'Owner draw, retained earnings, reinvestment' },
          { id: 'markupPct',       label: 'Resulting markup %', hint: 'Calculated from TMR and variable cost' },
          { id: 'gpmPct',          label: 'Resulting gross profit margin %', hint: '100% minus variable cost percentage' },
        ],
      },
      {
        id: 'four-step-pricing',
        label: 'Four-Step Pricing Logic',
        type: 'list',
        prompt: 'Once sufficiency is locked, every project follows the same logic. List four steps, each starting with —. Cover: calculate total variable cost; divide by VC% for project price; remainder covers fixed costs and profit; savings vs projection become retained earnings.',
      },
      {
        id: 'margin-flexibility',
        label: 'Margin Flexibility',
        type: 'grid',
        prompt: 'Not every project hits target margin. The discipline is knowing when to flex, when to hold, and when to walk away.',
        targetRows: 3,
        columns: [
          { id: 'tier',      label: 'Margin Tier' },
          { id: 'range',     label: 'Range' },
          { id: 'whenApply', label: 'When to Apply' },
        ],
      },
      {
        id: 'tier-pricing-architecture',
        label: 'Tier Pricing Architecture',
        type: 'grid',
        prompt: 'Tiered pricing replaces custom-quoting. Each tier carries a price range and corresponding variable cost budget — 70% of every project price allocated to delivering the work.',
        targetRows: 4,
        columns: [
          { id: 'tier',          label: 'Tier' },
          { id: 'priceRange',    label: 'Price Range' },
          { id: 'threshold',     label: 'Threshold (Above)' },
          { id: 'vcBudget',      label: 'Variable Cost Budget' },
        ],
      },
      {
        id: 'team-composition',
        label: 'Creative Team Composition by Tier',
        type: 'grid',
        prompt: 'Team size scales with tier. Match team to project — don\'t over-staff Core, don\'t under-staff Premium.',
        targetRows: 4,
        columns: [
          { id: 'tier',     label: 'Tier' },
          { id: 'teamSize', label: 'Team Size' },
          { id: 'profile',  label: 'Talent Profile' },
          { id: 'approach', label: 'Project Approach' },
        ],
      },
      {
        id: 'tier-positioning',
        label: 'Marketing Positioning by Tier',
        type: 'grid',
        prompt: 'Each tier needs its own pitch — a sentence that captures what the client gets and why this tier costs what it does.',
        targetRows: 4,
        columns: [
          { id: 'tier',        label: 'Tier' },
          { id: 'positioning', label: 'Sample positioning' },
        ],
      },
      {
        id: 'economies-of-scale',
        label: 'Economies of Scale Strategies',
        type: 'list',
        prompt: 'Strategies for structurally lowering variable costs without reducing quality. Each row starts with —. Cover labor (ECN library, standardized kits, short-term contracts), equipment (owned over rental, long-term deals, scheduling utilization), materials (bulk purchase, inventory system, reusable elements), and admin (single-platform booking, annual renegotiation, per-project tracking).',
      },
      {
        id: 'ecn-roles',
        label: 'Extended Creative Network — Starting Roles',
        type: 'list',
        prompt: 'The fifteen foundational roles to build the ECN library against before expanding. Each row starts with —. Cover the production roles in order: Cinematographer/DP, Photographer, Director, Editor, Set Designer, Project Manager, Live Editor, Colorist, Mixer/Sound Designer, Creative Director, Producer, Lighting Tech/Gaffer, Animator/MoGfx, Camera Operator, plus one studio-specialization role.',
      },
      {
        id: 'ecn-role-profile',
        label: 'ECN Role Profile Template',
        type: 'fields',
        prompt: 'For each role in the network, document the profile below. This becomes the source of truth for quoting, scoping, and freelancer onboarding.',
        fields: [
          { id: 'roleTitle',         label: 'Role title',            hint: 'Standardized name used across all internal documents' },
          { id: 'coreSkills',        label: 'Core skills',           hint: 'Minimum capability set for the role' },
          { id: 'tierFeatures',      label: 'Tier-unlocked features',hint: 'Specialized capabilities at Essential, Smart, Premium' },
          { id: 'halfDayRate',       label: 'Rate range — half day', hint: 'Negotiated half-day rates by tier' },
          { id: 'fullDayRate',       label: 'Rate range — full day', hint: 'Negotiated full-day rates by tier' },
          { id: 'equipmentIncluded', label: 'Equipment included',    hint: 'Any kit the freelancer brings as standard' },
          { id: 'pastProjects',      label: 'Notable past projects', hint: 'Quick reference for client-facing case studies' },
          { id: 'availability',      label: 'Availability windows',  hint: 'Typical lead time and recurring blackouts' },
        ],
      },
      {
        id: 'worked-example',
        label: 'Worked Example — Pricing a Project',
        type: 'fields',
        prompt: 'Apply the framework to a sample project. Walk through the steps to validate the approach.',
        fields: [
          { id: 'project',          label: 'Project',                  hint: 'Brief description' },
          { id: 'tier',             label: 'Tier classification',      hint: 'Core / Essential / Smart / Premium' },
          { id: 'laborCosts',       label: 'Labor costs',              hint: 'Sum of all freelancer fees' },
          { id: 'equipmentCosts',   label: 'Equipment rental costs',   hint: 'Sum of all rental line items' },
          { id: 'materialsCosts',   label: 'Materials & supplies costs', hint: 'Set, props, consumables' },
          { id: 'adminCosts',       label: 'Administrative costs',     hint: 'Travel, meals, miscellaneous' },
          { id: 'totalVariable',    label: 'Total variable costs',     hint: 'Sum of the four categories' },
          { id: 'projectPrice',     label: 'Project price (calculated)', hint: 'Variable costs / VC%' },
          { id: 'markupPct',        label: 'Markup %',                 hint: 'Calculated' },
          { id: 'gpmPct',           label: 'Gross profit margin %',    hint: 'Calculated' },
          { id: 'decision',         label: 'Decision',                 hint: 'Quote, restructure, or decline' },
        ],
      },
      {
        id: 'governance',
        label: 'Governance & Review',
        type: 'fields',
        prompt: 'A pricing framework that doesn\'t get reviewed becomes wrong. Build review cadence into the studio\'s operating rhythm.',
        fields: [
          { id: 'monthlyReview',  label: 'Monthly review',  hint: 'Compare projected vs actual variable costs across all live projects' },
          { id: 'quarterlyReview',label: 'Quarterly review',hint: 'Recalibrate sufficiency figures and tier price ranges' },
          { id: 'annualReview',   label: 'Annual review',   hint: 'Full framework review — tier definitions, ECN, target margins, fixed costs' },
          { id: 'frameworkOwner', label: 'Framework owner', hint: 'Senior leader responsible for the framework' },
          { id: 'dataOwner',      label: 'Data owner',      hint: 'Operations or finance lead maintaining cost and margin data' },
          { id: 'ecnOwner',       label: 'ECN owner',       hint: 'Producer or talent lead maintaining the freelancer library' },
          { id: 'reviewChair',    label: 'Review chair',    hint: 'Who runs the quarterly review meeting' },
        ],
      },
    ],
    systemPrompt: 'You are filling a Function Creative Company Production Budgeting Framework. This is a strategic methodology, not a line-item budget. Be specific with realistic numbers but use TBD where studio-specific data should go. Currency in USD unless specified.',
  },

  {
    id: 'shooting-schedule',
    label: 'Shooting Schedule',
    desc: 'A structural framework for building, maintaining, and distributing production schedules across episodic, feature, and commercial shoots.',
    type: 'epk',
    icon: 'cal',
    fccCode: 'FCC / TPL-04',
    sections: [
      {
        id: 'schedule-overview',
        label: 'Schedule Overview',
        type: 'fields',
        prompt: 'The shooting schedule is the most-read document on any production. Get it right and the whole machine runs; get it wrong and every department misfires.',
        fields: [
          { id: 'projectTitle',     label: 'Project Title',     hint: 'Series, film, or commercial name' },
          { id: 'productionCompany',label: 'Production Company',hint: 'Producing entity' },
          { id: 'scheduleVersion',  label: 'Schedule Version',  hint: 'Numbered draft (e.g. Draft 5)' },
          { id: 'dateIssued',       label: 'Date Issued',       hint: 'When this version was published' },
          { id: 'scheduleOwner',    label: 'Schedule Owner',    hint: 'First Assistant Director or scheduling producer' },
          { id: 'totalDays',        label: 'Total Shoot Days',  hint: 'Calendar days from start of principal to wrap' },
          { id: 'totalPages',       label: 'Total Pages',       hint: 'Cumulative page count of all scenes' },
          { id: 'format',           label: 'Format',            hint: 'Single camera, multi-camera, mixed unit' },
        ],
      },
      {
        id: 'scheduling-logic',
        label: 'Scheduling Logic',
        type: 'list',
        prompt: 'The principles governing how this schedule was built. Each row starts with —. Cover: grouping by location, clustering cast availability, scheduling complex setups when crew is fresh, front-loading weather risk, buffer days for contingency, and any production-specific principles.',
      },
      {
        id: 'page-count-targets',
        label: 'Daily Page Count Targets',
        type: 'fields',
        prompt: 'Lock the page count discipline before scheduling individual days.',
        fields: [
          { id: 'targetPerDay',  label: 'Target page count per day',    hint: 'Typical 4-6 pages on standard scripted productions' },
          { id: 'tolerance',     label: 'Page count tolerance',         hint: 'Acceptable variance day to day' },
          { id: 'maxDailyPages', label: 'Maximum daily page count',     hint: 'Hard ceiling that triggers schedule restructuring' },
          { id: 'specialUnits',  label: 'Stunts & special unit days',   hint: 'Reduced page count expectations' },
        ],
      },
      {
        id: 'union-constraints',
        label: 'Cast & Union Constraints',
        type: 'list',
        prompt: 'Constraints that govern crew/cast scheduling. Each row starts with —. Cover: 12-hour turnaround, 6-day work week, child performer hours, stunt double availability, plus region-specific union or production agreements.',
      },
      {
        id: 'cast-numbers',
        label: 'Cast Number Reference',
        type: 'grid',
        prompt: 'Every cast member is assigned a permanent cast number that appears against scenes throughout the schedule. The number stays consistent across every version. Reserve the first numbers for series regulars or principal cast.',
        targetRows: 10,
        columns: [
          { id: 'castNumber', label: 'Cast #' },
          { id: 'character',  label: 'Character' },
          { id: 'performer',  label: 'Performer' },
          { id: 'notes',      label: 'Notes' },
        ],
      },
      {
        id: 'location-index',
        label: 'Location Index',
        type: 'grid',
        prompt: 'Catalogue every shooting location with its real-world venue, access constraints, and the scenes scheduled there. The bridge between the schedule and the location department.',
        targetRows: 6,
        columns: [
          { id: 'scriptName', label: 'Location Name (script)' },
          { id: 'venue',      label: 'Actual Venue' },
          { id: 'cityRegion', label: 'City / Region' },
          { id: 'access',     label: 'Access Notes' },
        ],
      },
      {
        id: 'unit-structure',
        label: 'Unit Structure',
        type: 'grid',
        prompt: 'Most productions run more than one unit at some point. Define each unit\'s purpose and boundaries before assigning scenes.',
        targetRows: 4,
        columns: [
          { id: 'unit',     label: 'Unit' },
          { id: 'purpose',  label: 'Purpose' },
          { id: 'days',     label: 'Days Scheduled' },
          { id: 'crewLead', label: 'Crew Lead' },
        ],
      },
      {
        id: 'shoot-days',
        label: 'Shoot Days',
        type: 'repeating',
        prompt: 'Each shoot day gets its own block. Most productions run 20-60 days. For this template, generate the first 5 days as a demonstrable structure.',
        targetCount: 5,
        instanceLabel: 'Shoot Day',
        sub: [
          { id: 'dayNumber',  label: 'Day Number',          type: 'prose' },
          { id: 'dayDate',    label: 'Day & Date',          type: 'prose' },
          { id: 'dayType',    label: 'Day Type',            type: 'prose' },
          { id: 'locationGroup', label: 'Location Group',   type: 'prose' },
          { id: 'crewCall',   label: 'Crew Call',           type: 'prose' },
          { id: 'firstShot',  label: 'First Shot',          type: 'prose' },
          { id: 'lunch',      label: 'Lunch',               type: 'prose' },
          { id: 'wrap',       label: 'Estimated Wrap',      type: 'prose' },
          { id: 'pageCount',  label: 'Total Page Count',    type: 'prose' },
          { id: 'weatherCover', label: 'Weather Contingency', type: 'prose' },
          { id: 'scenes',     label: 'Scenes Scheduled',    type: 'prose' },
          { id: 'dayNotes',   label: 'Day Notes',           type: 'prose' },
        ],
      },
      {
        id: 'travel-off-days',
        label: 'Travel, Turnaround & Off Days',
        type: 'grid',
        prompt: 'Non-shooting days are part of the schedule. Track them so the line producer can budget transport, accommodation, and per-diem accurately. Day types include travel, turnaround, prep, weather hold, weekend, public holiday, hiatus.',
        targetRows: 6,
        columns: [
          { id: 'date',     label: 'Date' },
          { id: 'dayType',  label: 'Day Type' },
          { id: 'detail',   label: 'Detail' },
          { id: 'affected', label: 'Affected Crew / Cast' },
        ],
      },
      {
        id: 'schedule-summary',
        label: 'Schedule Summary',
        type: 'fields',
        prompt: 'A one-page summary of the total schedule, used for production accounting, insurance, and client reporting.',
        fields: [
          { id: 'mainUnitDays',     label: 'Total shoot days — main unit',     hint: 'Count' },
          { id: 'secondUnitDays',   label: 'Total shoot days — second unit',   hint: 'Count' },
          { id: 'splinterDays',     label: 'Total splinter / drone / plates days', hint: 'Count' },
          { id: 'travelDays',       label: 'Total travel days',                hint: 'Count' },
          { id: 'weatherHoldDays',  label: 'Total weather hold days budgeted', hint: 'Count' },
          { id: 'totalPages',       label: 'Total cumulative page count',      hint: 'Sum across all units' },
          { id: 'avgPagesPerDay',   label: 'Average pages per day — main unit',hint: 'Calculated' },
          { id: 'locationsCount',   label: 'Locations covered',                hint: 'Number of unique locations' },
          { id: 'castDaysRegulars', label: 'Cast days — series regulars',      hint: 'Total contracted days' },
          { id: 'castDaysGuest',    label: 'Cast days — guest / recurring',    hint: 'Total contracted days' },
        ],
      },
    ],
    systemPrompt: 'You are filling a Function Creative Company Shooting Schedule. Be specific, realistic, production-grade. Time slots in 24-hour format. Use realistic-looking placeholder dates and times where the user has not provided specifics.',
  },

  {
    id: 'series-bible',
    label: 'Series Bible',
    desc: 'A structural framework for developing television series, web series, and serialized streaming content from concept through episode breakdown.',
    type: 'series',
    icon: 'file',
    fccCode: 'FCC / TPL-05',
    sections: [
      {
        id: 'concept',
        label: 'The Concept',
        type: 'fields',
        prompt: 'The opening pages of any bible. Buyers, financiers, and writers\' rooms read these first. Get the title, genre, and format right and the rest of the document earns the reader\'s attention.',
        fields: [
          { id: 'workingTitle',    label: 'Working title',           hint: 'The title of the series' },
          { id: 'genre',           label: 'Genre',                   hint: 'Primary and secondary genres' },
          { id: 'format',          label: 'Format',                  hint: 'Episode count and runtime — e.g. 6 x 60\', 10 x 30\'' },
          { id: 'languages',       label: 'Language(s)',             hint: 'Languages spoken in the show' },
          { id: 'productionCompany', label: 'Production company',    hint: 'Producing entity' },
          { id: 'createdBy',       label: 'Created by',              hint: 'Creator credit(s)' },
          { id: 'showrunner',      label: 'Showrunner / head writer',hint: 'If different from creator' },
          { id: 'targetPlatform',  label: 'Target platform',         hint: 'Streamer, broadcaster, theatrical' },
        ],
      },
      {
        id: 'logline-question-idea',
        label: 'Logline, Dramatic Question & Controlling Idea',
        type: 'fields',
        prompt: 'The three pieces of writing that anchor the bible. The logline tells the reader what the series is. The dramatic question drives the season. The controlling idea is the thematic argument.',
        fields: [
          { id: 'logline',         label: 'Logline',           hint: 'Two to four sentences. Make a reader lean in, not lean back. Tell what the series is, who its protagonist is, what they want, what stands in their way.' },
          { id: 'dramaticQuestion',label: 'Dramatic question', hint: 'One sentence, phrased as a question. The question that drives the season — and that the season answers.' },
          { id: 'controllingIdea', label: 'Controlling idea',  hint: 'Two to four sentences articulating the show\'s central thematic claim. Not a slogan — a worldview.' },
        ],
      },
      {
        id: 'series-synopsis',
        label: 'Series Synopsis',
        type: 'prose',
        prompt: 'The full narrative arc of the season, told as story. Aim for two to five paragraphs. Move chronologically through the season, but don\'t reduce it to bullet points. Use scene-level texture — surprises, reversals, moments of intimacy. End on the note the season ends on. Present tense, active voice.',
      },
      {
        id: 'creators-intent',
        label: 'Creators\' Intent',
        type: 'prose',
        prompt: 'The why behind the show. Three or four paragraphs in the creators\' voice. Answer three questions: Why this story? Why now? Why us? Reference what audiences will get from the show that they can\'t get elsewhere — in human terms, not industry-jargon.',
      },
      {
        id: 'treatment',
        label: 'Treatment',
        type: 'fields',
        prompt: 'How the show actually works as a piece of television. Structural choices and storytelling rules.',
        fields: [
          { id: 'episodicStructure', label: 'Episodic structure', hint: 'How does each episode begin, build, and resolve? Procedural beats? Cold opens? Cliffhangers? Multi-strand storytelling?' },
          { id: 'seasonStructure',   label: 'Season structure',   hint: 'Where does the season pivot? Where does the midpoint sit? What\'s the difference between the first and final episodes\' tone and stakes?' },
          { id: 'ipConnection',      label: 'Connection to existing IP', hint: 'If this is a spin-off, prequel, sequel, or part of a wider universe. Skip if not applicable.' },
        ],
      },
      {
        id: 'themes',
        label: 'Themes',
        type: 'repeating',
        prompt: 'The thematic territory the show occupies. Three themes is typical — fewer feels thin, more feels unfocused. Each should be the kind of thing a critic would identify after watching the show, not a list of topics.',
        targetCount: 3,
        instanceLabel: 'Theme',
        sub: [
          { id: 'name',        label: 'Theme name',  type: 'prose' },
          { id: 'articulation', label: 'Articulation', type: 'prose' },
        ],
      },
      {
        id: 'world',
        label: 'The World',
        type: 'fields',
        prompt: 'The show\'s setting, atmosphere, and rules of engagement. Some shows have literal worlds; most have figurative ones — a profession, a community, a family dynamic, a city.',
        fields: [
          { id: 'storyWorld',      label: 'Story world',           hint: 'Two to four paragraphs. Central social, professional, or geographic territory the show lives in. Rules. Texture of daily life.' },
          { id: 'visualReferences',label: 'Visual & tonal references', hint: 'Films, series, photographers, painters, music, visual cultures the show draws from.' },
          { id: 'tone',            label: 'Tone',                  hint: 'One paragraph capturing the show\'s emotional register. Comedic? Melancholic? Procedural? Surreal?' },
        ],
      },
      {
        id: 'lead-characters',
        label: 'Lead Characters',
        type: 'repeating',
        prompt: 'Detailed profiles of every series regular. Most series bibles cover three to six leads in detail. Each profile follows the same structure for ensemble comparison.',
        targetCount: 4,
        instanceLabel: 'Character',
        sub: [
          { id: 'name',         label: 'Name',          type: 'prose' },
          { id: 'age',          label: 'Age',           type: 'prose' },
          { id: 'want',         label: 'Want',          type: 'prose' },
          { id: 'need',         label: 'Need',          type: 'prose' },
          { id: 'wound',        label: 'Wound',         type: 'prose' },
          { id: 'comedicFlaw',  label: 'Comedic flaw',  type: 'prose' },
          { id: 'traits',       label: 'Traits',        type: 'prose' },
          { id: 'profile',      label: 'Profile',       type: 'prose' },
          { id: 'arc',          label: 'Season arc',    type: 'prose' },
        ],
      },
      {
        id: 'episode-synopses',
        label: 'Episode Synopses',
        type: 'repeating',
        prompt: 'A paragraph or two on each episode of the season. Episode synopses show how the season is structured episode by episode without locking the writers\' room into beat-by-beat rigidity. End on the season finale.',
        targetCount: 6,
        instanceLabel: 'Episode',
        sub: [
          { id: 'number',   label: 'Episode #', type: 'prose' },
          { id: 'title',    label: 'Title',     type: 'prose' },
          { id: 'synopsis', label: 'Synopsis',  type: 'prose' },
        ],
      },
      {
        id: 'season-beyond',
        label: 'Season One and Beyond',
        type: 'prose',
        prompt: 'How does the show extend beyond the first season? One to two paragraphs sketching where Season Two could go, what the broader franchise potential looks like, and which characters or themes carry forward. Buyers want to see runway.',
      },
    ],
    systemPrompt: 'You are filling a Function Creative Company Series Bible. Write with conviction and specificity, like a working showrunner pitching the network. Use present tense and active voice for narrative sections.',
  },
  // ──────────────────────────────────────────────────────────────
  // Added May 19, 2026 — templates TPL-06 through TPL-10 ported
  // from the monolithic build (nia_app.jsx) into the split repo.
  // These five templates extend the Models library from 5 → 10:
  //   · TPL-06 Brand Bible (with Visual Reference Board)
  //   · TPL-07 Customer Discovery
  //   · TPL-08 Legal Agreement
  //   · TPL-09 Non-Disclosure Agreement (Mutual)
  //   · TPL-10 Partnership Profit & Equity Split
  // ──────────────────────────────────────────────────────────────
  {
    // ──────────────────────────────────────────────────────────────
    // Brand Bible — Adapted from the Series Bible structure but tuned
    // for brand identity development, brand reset, and creative
    // direction engagements. Same architectural DNA (concept-first,
    // narrative-driven, stakeholder-signoff-aware) translated from
    // television to brand work. Source pattern: Sanaa Groove × Function
    // Studios Brand Reset (May 2026, Ikanyeng Rammutla CD).
    // ──────────────────────────────────────────────────────────────
    id: 'brand-bible',
    label: 'Brand Bible',
    desc: 'A development framework for brand identity, brand resets, and creative direction engagements — from positioning and pillars through to deployment and team handoff.',
    type: 'brand',
    icon: 'file',
    fccCode: 'FCC / TPL-06',
    sections: [
      {
        id: 'brand-summary',
        label: 'Project Definition',
        type: 'fields',
        prompt: 'The header that any collaborator reads first. Every field is non-negotiable; if you cannot fill one, the reset is not yet ready to start.',
        fields: [
          { id: 'projectName',    label: 'Project',          hint: 'Brand and engagement name (e.g. Sanaa Groove — Brand Reset)' },
          { id: 'client',         label: 'Client',           hint: 'The brand commissioning the work, formal name' },
          { id: 'type',           label: 'Type',             hint: 'Brand identity development · brand reset · creative direction engagement' },
          { id: 'creativeDirector', label: 'Creative Director', hint: 'The named CD leading the work' },
          { id: 'clientLeads',    label: 'Client lead(s)',   hint: 'Named individuals from the client side, with the lane each owns (e.g. Trina — visuals)' },
          { id: 'workingStyle',   label: 'Working style',    hint: 'The CD\'s working archetype on this brief (Visionary, Collaborator, Operator, etc.)' },
          { id: 'timeline',       label: 'Timeline',         hint: 'Length and phasing (e.g. 12 weeks · Phase 1A → 1C)' },
          { id: 'budgetFrame',    label: 'Budget frame',     hint: 'Partnership rate, day rate, or scoped fee — terms language only' },
          { id: 'status',         label: 'Status',           hint: 'Where the engagement sits today (Active, Awaiting brief, Scoping, etc.)' },
          { id: 'projectId',      label: 'Project ID',       hint: 'Internal reference code' },
          { id: 'lastUpdated',    label: 'Last updated',     hint: 'YYYY-MM-DD of the most recent revision' },
        ],
      },
      {
        id: 'direction-statement',
        label: 'Direction Statement',
        type: 'prose',
        prompt: 'Two to four paragraphs. What this engagement is, in the CD\'s own voice — not the client\'s, not the agency\'s. State the working title of the direction (e.g. "The brand reset is the work"), describe what the brand already has and what it does not yet have, and close with the one-sentence argument for why this work has to happen before any more content gets made.',
      },
      {
        id: 'pain-points',
        label: 'Pain Points',
        type: 'repeating',
        prompt: 'The specific frictions this brief is built to resolve. Three to five. Each has a short, named heading (e.g. "The translation gap") and one to two sentences articulating the problem. These become the success criteria — if the reset doesn\'t resolve these, it failed.',
        targetCount: 4,
        instanceLabel: 'Pain point',
        sub: [
          { id: 'name',        label: 'Pain point name',  type: 'prose' },
          { id: 'articulation', label: 'Articulation',    type: 'prose' },
        ],
      },
      {
        id: 'six-stage-workflow',
        label: 'The 6-Stage Workflow',
        type: 'repeating',
        prompt: 'How the reset is built. Six stages, each with its own deliverable and exit criteria. The standard order is: Concept & Narrative → Campaign Thinking → Visual Translation → Production Understanding → Collaboration → Final Output. Adapt language to the brief but keep the architecture — every stage is gated by the previous stage\'s output.',
        targetCount: 6,
        instanceLabel: 'Stage',
        sub: [
          { id: 'stageNumber',  label: 'Stage number', type: 'prose' },
          { id: 'name',         label: 'Stage name',   type: 'prose' },
          { id: 'description',  label: 'Description',  type: 'prose' },
          { id: 'output',       label: 'Output',       type: 'prose' },
        ],
      },
      {
        id: 'deliverables',
        label: 'Deliverables',
        type: 'list',
        prompt: 'The artifacts produced by the engagement. Each row starts with —. Be concrete about format (PDF, Figma file, one-page document) and named scope (the actual templates, the named guides). Four artifacts is typical; more than six means scope has crept.',
      },
      {
        id: 'audience',
        label: 'Audience',
        type: 'fields',
        prompt: 'Who the brand work is ultimately for. Three layers: the people who already engage, the network the brand recruits from next, the institutions and partners scouting the category.',
        fields: [
          { id: 'primary',     label: 'Primary audience',   hint: 'The core community the brand serves today — specific demographic, geography, behaviour' },
          { id: 'secondary',   label: 'Secondary audience', hint: 'The adjacent network the future of the brand builds from' },
          { id: 'tertiary',    label: 'Tertiary audience',  hint: 'Brand partners, sponsors, institutions scouting the category — without the work reading as pitched at them' },
        ],
      },
      {
        id: 'references',
        label: 'References & Inspirations',
        type: 'fields',
        prompt: 'The taste profile of the engagement, curated by the CD. Three blocks: the editorial sensibility the brand aspires to, the visual references it draws from, and the explicit "not this" list. The "not this" block is often the most useful — it disciplines the visual system before it starts building.',
        fields: [
          { id: 'editorial',     label: 'Editorial sensibility',  hint: 'Magazines, publications, archives whose discipline the brand adopts (not the aesthetic — the discipline)' },
          { id: 'visual',        label: 'Visual reference set',   hint: 'Photographers, designers, visual cultures the brand draws from' },
          { id: 'notThis',       label: 'What we are not',        hint: 'The explicit list of aesthetics, templates, and visual languages the brand rejects' },
        ],
      },
      {
        // Visual reference board — added turn 50 alongside the existing
        // text-based "References & Inspirations" section above. This is
        // where Pinterest / Instagram boards, uploaded moodboards,
        // sample shots, and other visual references live. Pairs with
        // the written brief above: the text says what the references
        // mean, the board shows them.
        id: 'visual-references',
        label: 'Visual Reference Board',
        type: 'references',
        prompt: 'Paste URLs to Pinterest boards, Instagram posts, Behance galleries, or upload images and short videos directly. Each card carries a label so collaborators understand why a reference is here. Foundation tier: up to 5 URL references. Professional: unlimited references plus image/video upload, drag-and-drop, and clipboard paste.',
      },
      {
        id: 'editorial-pillars',
        label: 'Editorial Pillars',
        type: 'repeating',
        prompt: 'Three to four content pillars — no more. Pillars define what the brand publishes; templates (handled elsewhere) define how. Each pillar has a name and one to two sentences describing the editorial shape.',
        targetCount: 4,
        instanceLabel: 'Pillar',
        sub: [
          { id: 'name',         label: 'Pillar name',  type: 'prose' },
          { id: 'description',  label: 'Description',  type: 'prose' },
        ],
      },
      {
        id: 'timeline-phases',
        label: 'Timeline — Phased Roadmap',
        type: 'grid',
        prompt: 'The engagement broken into phases with dates and activities. Standard shape: Phase 1A (kickoff) → 1B (build) → 1C (lock) → 2 (deployment). Each phase row carries its window, its activities, and the exit criteria that gate the next phase.',
        targetRows: 4,
        columns: [
          { id: 'phase',      label: 'Phase' },
          { id: 'window',     label: 'Window' },
          { id: 'activities', label: 'Activities' },
        ],
      },
      {
        id: 'decisions',
        label: 'Decisions',
        type: 'fields',
        prompt: 'What must land before each phase opens. The discipline of writing these down is half the point — phases drift when decisions stay in conversation.',
        fields: [
          { id: 'beforePhase1B', label: 'Before Phase 1B opens', hint: 'The decisions that must be locked before the build phase begins' },
          { id: 'beforePhase1C', label: 'Before Phase 1C opens', hint: 'The decisions that must be locked before the identity locks' },
          { id: 'beforePhase2',  label: 'Before Phase 2 opens',  hint: 'The decisions that must be locked before deployment begins' },
        ],
      },
      {
        id: 'risks',
        label: 'Risks',
        type: 'repeating',
        prompt: 'What the CD is watching. Four to six risks is typical. Each risk has a short name and one to two sentences naming the failure mode and the mitigation in the same breath.',
        targetCount: 5,
        instanceLabel: 'Risk',
        sub: [
          { id: 'name',         label: 'Risk',          type: 'prose' },
          { id: 'articulation', label: 'Articulation',  type: 'prose' },
        ],
      },
      {
        id: 'archive-learning',
        label: 'Archive & Learning',
        type: 'prose',
        prompt: 'What nOS keeps from this engagement. Every brand reset taught to the platform compounds. List the things the system retains — the taste profile, the reusable workflow archetype, the reference sets, the brand record itself. One paragraph, written in third person ("The system retains…").',
      },
    ],
    systemPrompt: 'You are filling a Brand Bible. Write with the conviction of a working Creative Director presenting to a brand\'s founding team. Use specific names, specific references, specific deliverables — never placeholder language. Active voice. The CD\'s judgement is the asset.',
  },
  {
    // ──────────────────────────────────────────────────────────────
    // TPL-07 · Customer Discovery
    // Customer-discovery / brand-intake framework. Captures purpose,
    // audience, style preferences, content cadence, output specs, and
    // distribution + monetization plans in one structured document.
    // Pattern source: Talia Management survey (October 2025) for the
    // Daily Reposition brand build. Reusable for any agency-style
    // brand intake — Sanaa Groove, future client work.
    // ──────────────────────────────────────────────────────────────
    id: 'customer-discovery',
    label: 'Customer Discovery',
    desc: 'A brand-intake framework. Captures mission and vision, target audience, creative direction, content strategy, output specifications, and distribution plans — typically as the first work product when onboarding a new brand or client.',
    type: 'brand',
    icon: 'file',
    fccCode: 'FCC / TPL-07',
    sections: [
      {
        id: 'project-definition',
        label: 'Project Definition',
        type: 'fields',
        prompt: 'Header fields that any collaborator reads first. The brand or client name, who is leading the engagement, and the engagement frame.',
        fields: [
          { id: 'projectName',      label: 'Project',           hint: 'The intake or discovery engagement name' },
          { id: 'client',           label: 'Client',            hint: 'The brand or person being discovered' },
          { id: 'engagementType',   label: 'Engagement type',   hint: 'Brand intake · customer discovery · onboarding survey · refresh' },
          { id: 'creativeDirector', label: 'Creative Director', hint: 'The CD leading discovery' },
          { id: 'submittedBy',      label: 'Submitted by',      hint: 'Who filled out this discovery (founder, brand lead, etc.)' },
          { id: 'submittedOn',      label: 'Submitted on',      hint: 'YYYY-MM-DD' },
          { id: 'status',           label: 'Status',            hint: 'Submitted · Under review · Approved · Translated to brief' },
          { id: 'projectId',        label: 'Project ID',        hint: 'Internal reference code' },
        ],
      },
      {
        id: 'purpose-vision',
        label: 'Purpose & Vision',
        type: 'prose',
        prompt: 'Two to four paragraphs. The brand\'s mission in the founder\'s own voice. What it does, who it serves, how success is measured. Quote directly where possible — this section is the most unfiltered signal of brand identity.',
      },
      {
        id: 'target-audience',
        label: 'Target Audience',
        type: 'fields',
        prompt: 'Who the brand is for. Mix of audience categories (multi-select tags) and ideal-member description (prose paragraph).',
        fields: [
          { id: 'audienceCategories',  label: 'Audience categories',  hint: 'Multi-select: local community / professional peers / youth or students / online/digital audience / other' },
          { id: 'idealMember',         label: 'Ideal community member', hint: 'A few sentences describing the person the brand most wants to reach' },
          { id: 'engagementMaturity',  label: 'Engagement maturity',  hint: 'Not yet engaged / building / growing / engaged / highly engaged' },
        ],
      },
      {
        id: 'style-direction',
        label: 'Style & Creative Direction',
        type: 'repeating',
        prompt: 'Style preferences and creative non-negotiables. One row per attribute. Include the references the brand looks to AND the references the brand is cautious of (anti-references are as informative as references).',
        targetCount: 4,
        instanceLabel: 'Style attribute',
        sub: [
          { id: 'attribute',  label: 'Attribute',  type: 'prose' },
          { id: 'value',      label: 'Value',      type: 'prose' },
          { id: 'notes',      label: 'Notes',      type: 'prose' },
        ],
      },
      {
        id: 'must-haves-must-nots',
        label: 'Must-Haves & Must-Nots',
        type: 'prose',
        prompt: 'The non-negotiables. What must be present in every piece of content the brand publishes; what must never appear. Be specific about colours, treatments, references, formats. This section is the brief\'s "do not break" list.',
      },
      {
        id: 'content-cadence',
        label: 'Content Cadence',
        type: 'repeating',
        prompt: 'The content types and the publication frequency for each. One row per format. Frequency is calendar-rooted (weekly, biweekly, monthly, etc.) — not "regular" or "often."',
        targetCount: 8,
        instanceLabel: 'Content type',
        sub: [
          { id: 'format',    label: 'Format',     type: 'prose' },
          { id: 'frequency', label: 'Frequency',  type: 'prose' },
          { id: 'purpose',   label: 'Purpose',    type: 'prose' },
        ],
      },
      {
        id: 'output-specs',
        label: 'Outputs & Specifications',
        type: 'fields',
        prompt: 'Delivery specifications. Formats, resolutions, naming conventions, watermarks, credits. The technical contract for every asset that leaves the studio.',
        fields: [
          { id: 'imageFormats',     label: 'Image formats',      hint: 'e.g. JPEG/PNG · 300 DPI for print · 1080×1350 for IG' },
          { id: 'videoFormats',     label: 'Video formats',      hint: 'e.g. MP4 1080p minimum, 4K for CGI · 9:16 for Reels' },
          { id: 'deckFormats',      label: 'Deck / press formats', hint: 'PDF or PNG at full export quality' },
          { id: 'watermark',        label: 'Watermark',          hint: 'Exact watermark text and placement' },
          { id: 'creditsTreatment', label: 'Credits treatment',  hint: 'Rolling credits, end card, in-caption, etc.' },
          { id: 'namingConvention', label: 'Naming convention',  hint: 'e.g. ProjectName_Client_Year.ext' },
          { id: 'colorGrading',     label: 'Color grading',      hint: 'Notes on grading consistency across formats' },
        ],
      },
      {
        id: 'distribution',
        label: 'Distribution & Monetization',
        type: 'fields',
        prompt: 'Where this brand publishes and how it makes money. Platform priorities, target engagement metrics, digital product strategy, paid-boost appetite, beyond-platform revenue plans.',
        fields: [
          { id: 'platforms',          label: 'Primary platforms',     hint: 'Comma-separated list, in priority order' },
          { id: 'engagementTarget',   label: 'Engagement target',     hint: 'e.g. 3.5–5% engagement rate' },
          { id: 'digitalProducts',    label: 'Digital products',      hint: 'What the brand wants to sell — templates, calendars, toolkits' },
          { id: 'paidBoostBudget',    label: 'Paid boost budget',     hint: 'Monthly figure or "discuss based on ROI"' },
          { id: 'beyondPlatform',     label: 'Beyond-platform plans', hint: 'Podcasts, speaking engagements, in-person revenue' },
        ],
      },
      {
        id: 'review-cadence',
        label: 'Review Cadence',
        type: 'fields',
        prompt: 'How content gets reviewed before and after publishing. Each field rates importance 1-10 of a review touchpoint.',
        fields: [
          { id: 'prePublishPeer',     label: 'Pre-publish peer feedback',        hint: '1–10 importance' },
          { id: 'clientSignOff',      label: 'Client / collaborator sign-off',    hint: '1–10 importance' },
          { id: 'postPublishMetrics', label: 'Post-publish analytics check',     hint: '1–10 importance' },
          { id: 'archiving',          label: 'Archiving for future asset library', hint: '1–10 importance' },
          { id: 'revisionsPerProject', label: 'Revisions per project',           hint: 'Numeric or band — "1-2 fast and focused" etc.' },
          { id: 'timelineIdeal',      label: 'Ideal timeline',                   hint: 'From initial idea to final execution — e.g. "3 weeks · 6 phases"' },
        ],
      },
    ],
    systemPrompt: 'You are filling a Customer Discovery framework. Write in the voice of the brand founder being discovered — preserve their own language, references, and idiosyncrasies. Do not abstract or generalise. The brand\'s specifics are the asset.',
  },
  {
    // ──────────────────────────────────────────────────────────────
    // TPL-08 · Legal Agreement
    // Trial deals, partnership agreements, freelance contracts. The
    // first legal framework in nOS. Pattern source: Sbur Labs trial
    // deal (May 2026). Captures parties, scope, deliverables, IP,
    // confidentiality, term, liability, and signatures in the
    // structure most short-form creative trial deals follow.
    //
    // Note this is a captured pattern, not legal advice. A real
    // engagement should still have counsel review before signing.
    // ──────────────────────────────────────────────────────────────
    id: 'legal-agreement',
    label: 'Legal Agreement',
    desc: 'A trial-deal / partnership / freelance-engagement agreement framework. Captures parties, scope of services, deliverables and acceptance criteria, compensation, IP and ownership, confidentiality, term, and signatures. Sourced from the Sbur Labs trial deal template, May 2026.',
    type: 'brand',
    icon: 'file',
    fccCode: 'FCC / TPL-08',
    sections: [
      {
        id: 'agreement-summary',
        label: 'Agreement Summary',
        type: 'fields',
        prompt: 'Header block — what kind of agreement this is and the high-level frame. Read first by counsel, by signatories, and by anyone trying to understand the engagement at a glance.',
        fields: [
          { id: 'agreementName',  label: 'Agreement name',   hint: 'Working name (e.g. Sbur Labs × Function Studios Trial Deal)' },
          { id: 'agreementType',  label: 'Agreement type',   hint: 'Trial · partnership · freelance · service · NDA · etc.' },
          { id: 'effectiveDate',  label: 'Effective date',   hint: 'YYYY-MM-DD when this agreement comes into force' },
          { id: 'jurisdiction',   label: 'Governing law',    hint: 'Country / state whose law governs disputes' },
          { id: 'agreementId',    label: 'Agreement ID',     hint: 'Internal reference code' },
          { id: 'status',         label: 'Status',           hint: 'Draft · Under review · Signed · Active · Expired · Terminated' },
        ],
      },
      {
        id: 'parties',
        label: 'Parties',
        type: 'repeating',
        prompt: 'Every party to the agreement. Legal name, entity type, signatory, contact address. Minimum two parties for a bilateral agreement; more for partnerships and multi-party deals.',
        targetCount: 2,
        instanceLabel: 'Party',
        sub: [
          { id: 'partyName',       label: 'Legal name',     type: 'prose' },
          { id: 'entityType',      label: 'Entity type',    type: 'prose' },
          { id: 'signatoryName',   label: 'Signatory',      type: 'prose' },
          { id: 'signatoryTitle',  label: 'Signatory title', type: 'prose' },
          { id: 'address',         label: 'Address',        type: 'prose' },
          { id: 'role',            label: 'Role in agreement', type: 'prose' },
        ],
      },
      {
        id: 'scope-of-services',
        label: 'Scope of Services',
        type: 'prose',
        prompt: 'Two to four paragraphs. What the engagement covers — and importantly, what it does NOT cover. Reference any attached statement of work or schedule. Be specific about disciplines, sites, and timeframes.',
      },
      {
        id: 'deliverables',
        label: 'Deliverables & Acceptance Criteria',
        type: 'repeating',
        prompt: 'Every artifact, service, or outcome the agreement commits to. Each row has the deliverable, when it\'s due, and the criteria by which it\'s accepted — vague acceptance criteria are the most common cause of disputes.',
        targetCount: 4,
        instanceLabel: 'Deliverable',
        sub: [
          { id: 'deliverable',       label: 'Deliverable',          type: 'prose' },
          { id: 'dueDate',           label: 'Due date',             type: 'prose' },
          { id: 'acceptanceCriteria', label: 'Acceptance criteria', type: 'prose' },
        ],
      },
      {
        id: 'compensation',
        label: 'Compensation & Payment',
        type: 'fields',
        prompt: 'Money terms. The headline rate, when invoices fire, when payment is due, what payment methods are accepted. Late-payment terms belong here too.',
        fields: [
          { id: 'totalValue',     label: 'Total contract value',  hint: 'Fixed fee or scoped range; currency required' },
          { id: 'rateStructure',  label: 'Rate structure',        hint: 'Fixed fee · day rate · retainer · milestone · success-based' },
          { id: 'paymentSchedule', label: 'Payment schedule',     hint: 'When invoices fire — e.g. 50% on signature, 50% on delivery' },
          { id: 'paymentTerms',   label: 'Payment terms',         hint: 'Net 30, Net 15, on receipt, etc.' },
          { id: 'paymentMethod',  label: 'Payment method',        hint: 'Bank transfer, Stripe, etc.' },
          { id: 'latePenalty',    label: 'Late payment penalty',  hint: 'Any interest or fee on overdue invoices' },
          { id: 'expenseHandling', label: 'Expense reimbursement', hint: 'What expenses are billable, approval process' },
        ],
      },
      {
        id: 'ip-ownership',
        label: 'IP & Ownership',
        type: 'prose',
        prompt: 'Who owns the work product. Whether ownership transfers on delivery, on payment, or stays with the creator with a license to the client. Whether the creator can use the work in portfolio. Address pre-existing IP (background materials brought to the engagement) separately. This section is the most-contested in creative contracts — be precise.',
      },
      {
        id: 'confidentiality',
        label: 'Confidentiality',
        type: 'prose',
        prompt: 'What information is confidential — typically business strategy, financial information, unreleased creative work, third-party information shared in confidence. How long obligations survive the agreement (often 2–5 years). Permitted disclosures (legal compulsion, professional advisors, etc.).',
      },
      {
        id: 'term-termination',
        label: 'Term & Termination',
        type: 'fields',
        prompt: 'How long the agreement runs and how it ends. Trial deals typically have short, fixed terms; partnerships often auto-renew. Termination clauses cover both convenience (either party can exit) and cause (breach, insolvency, IP issues).',
        fields: [
          { id: 'startDate',          label: 'Start date',            hint: 'YYYY-MM-DD' },
          { id: 'endDate',            label: 'End date',              hint: 'YYYY-MM-DD or "rolling"' },
          { id: 'renewal',            label: 'Renewal terms',         hint: 'Auto-renews / manual renewal / one-off' },
          { id: 'terminationConvenience', label: 'Termination for convenience', hint: 'Notice period and effect (e.g. 30 days written notice)' },
          { id: 'terminationCause',   label: 'Termination for cause', hint: 'What constitutes cause and the cure period' },
          { id: 'postTermObligations', label: 'Post-termination obligations', hint: 'What survives termination — confidentiality, IP, indemnity' },
        ],
      },
      {
        id: 'liability',
        label: 'Liability & Indemnification',
        type: 'prose',
        prompt: 'Cap on damages, exclusions of consequential damages, mutual indemnification for third-party claims arising from the indemnifying party\'s materials. Without a liability cap, a small trial deal can expose the creator to unlimited damages — counsel will always flag this section.',
      },
      {
        id: 'signatures',
        label: 'Signatures',
        type: 'repeating',
        prompt: 'Execution block. One row per signatory; matches the Parties section. Signature method (wet, electronic, DocuSign) noted for record-keeping.',
        targetCount: 2,
        instanceLabel: 'Signature',
        sub: [
          { id: 'signatoryName',  label: 'Signatory name',  type: 'prose' },
          { id: 'signatoryTitle', label: 'Title',           type: 'prose' },
          { id: 'forParty',       label: 'For party',       type: 'prose' },
          { id: 'signedOn',       label: 'Signed on',       type: 'prose' },
          { id: 'method',         label: 'Method',          type: 'prose' },
        ],
      },
    ],
    systemPrompt: 'You are filling a Legal Agreement framework. Write in plain, precise contract language. Use defined terms (the "Service Provider", the "Client") where appropriate. Be specific about dates, currencies, durations, and obligations. This is a structured template — counsel should still review the final document before signature.',
  },
  // ────────────────────────────────────────────────────────────
  // TPL-09 · Non-Disclosure Agreement (Mutual)
  // Added turn 58. Source-of-truth: Mutual Confidentiality
  // Agreement, We Are Soul Limited × Our Land Creative, 14 Mar
  // 2022. Nine sections per the framework spec; ships with the
  // Mutual variant as primary, Unilateral as a Develop-panel
  // toggle (not a separate Model). The disclaimer footer is
  // emitted at PDF export and is non-toggleable; that wiring
  // lives at the export layer, not in the section schema.
  // ────────────────────────────────────────────────────────────
  {
    id: 'nda-mutual',
    label: 'Non-Disclosure Agreement',
    desc: 'Mutual confidentiality agreement for early-stage conversations where both parties expect to share sensitive information. Nine sections covering parties, definitions of confidential information, duty, rights, term, and execution. Defaults to English-law Deed; US/SA/EU options exposed in the Develop panel. Unilateral variant available via the Direction toggle.',
    type: 'legal',
    icon: 'file',
    fccCode: 'FCC / TPL-09',
    sections: [
      {
        id: 'cover',
        label: 'Cover',
        type: 'fields',
        prompt: 'Document title block and effective date. Names the instrument and locks in the date obligations start running. Identifies the two sides by role (Transmitter / Recipient — in a Mutual NDA both parties hold both roles simultaneously).',
        fields: [
          { id: 'documentTitle',  label: 'Document title',   hint: 'e.g. Mutual Confidentiality Agreement, or Non-Disclosure Agreement' },
          { id: 'effectiveDate',  label: 'Effective date',   hint: 'YYYY-MM-DD when obligations start. NOT the signature date.' },
          { id: 'transmitter',    label: 'Transmitter party',hint: 'Legal entity name of the first party' },
          { id: 'recipient',      label: 'Recipient party',  hint: 'Legal entity name of the second party' },
          { id: 'form',           label: 'Form',             hint: 'Deed (UK) · Agreement (US/other)' },
          { id: 'jurisdiction',   label: 'Governing law',    hint: 'England & Wales · Delaware · NY · CA · South Africa · EU' },
        ],
      },
      {
        id: 'parties',
        label: 'Parties',
        type: 'fields',
        prompt: 'States who is legally bound. Full registered legal names — NOT brand shorthand. "Netflix International B.V." not "Netflix". The only place in the document where the legal entities are fully named with entity type, registration number, and registered address.',
        fields: [
          { id: 'party1Name',     label: 'Party 1 — legal name',     hint: 'Full registered legal name with entity type (Limited / LLC / Pty Ltd / B.V.)' },
          { id: 'party1Address',  label: 'Party 1 — registered address', hint: 'Registered office address' },
          { id: 'party1RegNo',    label: 'Party 1 — registration no.',   hint: 'Company / registration number, or "(an individual)" if not incorporated' },
          { id: 'party2Name',     label: 'Party 2 — legal name',     hint: 'Full registered legal name with entity type' },
          { id: 'party2Address',  label: 'Party 2 — registered address', hint: 'Registered office address' },
          { id: 'party2RegNo',    label: 'Party 2 — registration no.',   hint: 'Company / registration number, or "(an individual)"' },
        ],
      },
      {
        id: 'background',
        label: 'Background (Recitals)',
        type: 'prose',
        prompt: 'The "why we are here" paragraph. One or two sentences naming the project, opportunity, or relationship being evaluated. Specific enough to be meaningful but broad enough that the scope of confidential information stays useful. Avoid vague phrases like "general business purposes". Do NOT describe the confidential information itself — that belongs in Definitions.',
      },
      {
        id: 'definitions',
        label: 'Definitions — what counts as Confidential Information',
        type: 'prose',
        prompt: 'The single most-litigated section of any NDA. Draws the boundary around what is protected. Cover confidentiality both by designation (marked "confidential") and by obviousness (anyone would know it\'s sensitive). Keep the canonical phrasing: "information of any nature, including but not limited to personal, business, project and commercial information." List the media covered: emails, videos, drafts, sketches, plans, descriptions, calculations, methods, designs. State the standard exclusions: information already public, independently developed, lawfully obtained from a third party, or already known to the Recipient before disclosure.',
      },
      {
        id: 'duty',
        label: 'Duty of confidentiality',
        type: 'prose',
        prompt: 'What the Recipient is and isn\'t allowed to do with the Confidential Information. State the core obligations: (a) use only for the evaluation purpose stated in Background, (b) hold in strict confidence with the same care as own confidential information (no lower than a reasonable standard), (c) disclose only to officers/employees/advisors with a need to know and bound by equivalent obligations, (d) make no copies beyond what is necessary, (e) return or destroy on request. Include the standard carve-outs: disclosure required by law or court order (with prior notice where lawful).',
      },
      {
        id: 'rights',
        label: 'Rights — IP reservation',
        type: 'prose',
        prompt: 'Who owns what. State that no licence, transfer, or option over any IP is granted by this Agreement. Confidential Information disclosed remains the property of the disclosing party. The Recipient acquires no rights to develop, exploit, or register anything based on the Confidential Information without a separate written agreement. Include the no-prior-use clause where applicable.',
      },
      {
        id: 'term',
        label: 'Term & survival',
        type: 'fields',
        prompt: 'How long the obligations bite, and what survives termination. The agreement itself may terminate on a named trigger (release, public announcement, definitive agreement, or fixed date) but the confidentiality obligations typically survive for a defined window after termination.',
        fields: [
          { id: 'termTrigger',       label: 'Termination trigger',     hint: 'Project release · public announcement · definitive agreement · fixed date' },
          { id: 'survivalYears',     label: 'Survival window (years)', hint: '0 – 10. Default 1. > 5 triggers legal-review flag.' },
          { id: 'oralWindow',        label: 'Oral disclosure window (days)', hint: 'Days for written confirmation of orally-shared confidential info. Default 30.' },
          { id: 'returnObligation',  label: 'Return / destroy obligation',   hint: 'On termination, on request, or on completion of evaluation' },
        ],
      },
      {
        id: 'miscellaneous',
        label: 'Miscellaneous',
        type: 'prose',
        prompt: 'Amendments only in writing signed by both parties. Governing law and jurisdiction reaffirmed. Arbitration seat and language (if applicable — default arbitration over court litigation for commercial confidentiality disputes). Severability — if any clause is unenforceable, the rest of the agreement stands. Counterparts — the Agreement may be executed in counterparts, each of which is an original. No assignment without consent. Existence of the Agreement may itself be confidential (toggle this on for "in talks" announcements).',
      },
      {
        id: 'execution',
        label: 'Execution',
        type: 'fields',
        prompt: 'Signature blocks for each party. Includes name, capacity, date, and witness (for Deeds). For Deeds under English law, the signature block has specific formalities (signed AS A DEED, witnessed by an independent witness who is not a party).',
        fields: [
          { id: 'party1Signatory', label: 'Party 1 — signatory name', hint: 'Name of the person signing' },
          { id: 'party1Capacity',  label: 'Party 1 — capacity',       hint: 'Director · Authorised Signatory · (an individual)' },
          { id: 'party1Date',      label: 'Party 1 — signature date', hint: 'YYYY-MM-DD' },
          { id: 'party2Signatory', label: 'Party 2 — signatory name', hint: 'Name of the person signing' },
          { id: 'party2Capacity',  label: 'Party 2 — capacity',       hint: 'Director · Authorised Signatory · (an individual)' },
          { id: 'party2Date',      label: 'Party 2 — signature date', hint: 'YYYY-MM-DD' },
        ],
      },
    ],
    systemPrompt: 'You are filling a Mutual Non-Disclosure Agreement framework. Use the 9-section structure in order. Do not merge sections. Reject placeholder names — counterparties must be full registered legal entities or named individuals. Definitions section must cover confidentiality both by designation and by obviousness, list the standard media (emails, videos, drafts, sketches, plans, descriptions, calculations, methods, designs), and state the standard exclusions (public, independently developed, lawfully obtained, prior knowledge). Default survival window: 1 year unless specified otherwise. Default form: Deed for English law, Agreement for US/other. This is a structural template, not legal advice — a qualified lawyer in the relevant jurisdiction must review before execution.',
  },
  // ────────────────────────────────────────────────────────────
  // TPL-10 · Partnership Profit & Equity Split
  // Added turn 58. Source-of-truth: redacted internal partnership
  // agreement, five-partner creative-and-media venture, founded
  // 2024 (3 founding equity holders + 2 contributor-track
  // operational leads). Twelve sections per the framework spec.
  // The framework strictly separates profit-split (per-project,
  // contribution-based) from equity (ownership, time-based) —
  // these are independent allocation systems running in parallel.
  // ────────────────────────────────────────────────────────────
  {
    id: 'partnership-equity-split',
    label: 'Partnership Profit & Equity Split',
    desc: 'Internal economics of a continuing commercial venture — joint ventures, studio co-founderships, content collectives. Defines two parallel allocation systems: project-based profit split (with material-contribution-or-reserve mechanics) and equity ownership (with founder/founding-member tiers, an Equity Incentive Pool, and 4-year vesting). Twelve sections including eligibility gates for contributor-track partners and a strong Managing Member governance default.',
    type: 'financial',
    icon: 'file',
    fccCode: 'FCC / TPL-10',
    sections: [
      {
        id: 'cover',
        label: 'Cover',
        type: 'fields',
        prompt: 'Names the venture, identifies the form (LLC / partnership / unincorporated JV), and locks in the date the economic arrangements begin running. For pre-incorporation drafts, set effective date to the intended incorporation date.',
        fields: [
          { id: 'ventureName',     label: 'Venture name',       hint: 'Legal name of the venture, or working name if entity formation is pending' },
          { id: 'ventureType',     label: 'Venture type',       hint: 'LLC · Limited Company · General Partnership · Joint Venture · Pty Ltd · Other' },
          { id: 'effectiveDate',   label: 'Effective date',     hint: 'YYYY-MM-DD — when profit-split and equity-vesting clocks start' },
          { id: 'formationStatus', label: 'Formation status',   hint: 'Incorporated · Formation pending (re-execute inside formed entity within 90 days)' },
        ],
      },
      {
        id: 'parties',
        label: 'Parties',
        type: 'grid',
        prompt: 'Every party to the agreement, with their role(s) inside the venture and their commitment level. Roles can stack (one partner may hold CEO + Head of PR). Commitment levels: Founder (immediate equity, no cliff) · Founding Member (4-year vest, 1-year cliff) · Contributor-Track (no equity at start, eligible via Pool after Gates pass) · Later-Admitted (joins after incorporation, Pool grant from admission). At least one partner must be flagged as Managing Member.',
        columns: [
          { id: 'name',            label: 'Legal name',         hint: 'Full legal name' },
          { id: 'holdingEntity',   label: 'Holding entity',     hint: 'If signing through an entity, name it. Otherwise leave blank.' },
          { id: 'roles',           label: 'Roles',              hint: 'e.g. Managing Member · CEO · COO' },
          { id: 'commitment',      label: 'Commitment level',   hint: 'Founder · Founding Member · Contributor-Track · Later-Admitted' },
          { id: 'managingMember',  label: 'Managing?',          hint: 'Y for the one designated Managing Member, blank for others' },
        ],
        targetRows: 5,
      },
      {
        id: 'purpose',
        label: 'Purpose',
        type: 'prose',
        prompt: 'One or two sentences naming what the venture produces, who it serves, and how. Specific enough to be meaningful but not so narrow that legitimate adjacent work falls outside it. The purpose clause is the test that decides whether a given piece of work goes through the venture (and through the profit split) or stays with the individual partner outside it. If partners hold parallel solo practices, name them here as carve-outs.',
      },
      {
        id: 'profit-split',
        label: 'Profit Split — project-based, after expenses',
        type: 'grid',
        prompt: 'Project-based operating profit allocation. Applies project-by-project, after all direct expenses are paid. CONDITIONAL on material contribution — a partner who did not work on a given project does not receive their percentage; their share goes to the Operating Reserve. Equity-holding founders/founding members typically receive equal percentages (e.g. 20% each), contributor-track partners receive lower percentages (e.g. 10% each), Operating Reserve receives the remainder (minimum 20%). Percentages MUST sum to exactly 100%.',
        columns: [
          { id: 'allocation',      label: 'Allocation',         hint: 'Partner name OR "Operating Reserve"' },
          { id: 'profitPct',       label: 'Profit %',           hint: 'Numeric percentage. Must sum to 100% across all rows.' },
          { id: 'revertNote',      label: 'Reversion note',     hint: 'For contributor-track partners: "Added to Reserve when not participating"' },
        ],
        targetRows: 6,
      },
      {
        id: 'reserve-mechanics',
        label: 'Reserve Mechanics',
        type: 'prose',
        prompt: 'The reversion rule. When a partner does not materially contribute to a project, their allocated percentage reverts to the Operating Reserve — NOT redistributed to other partners. Preserve the canonical wording: "Profit participation is project-based and contingent upon material contribution. Any unearned profit allocation shall revert to the Company\'s operating reserve and shall not be redistributed to other participants." State the named exception: when another partner has demonstrably absorbed the absent partner\'s work, the share follows the work, documented in writing before paying. Material contribution is confirmed by the Managing Member at project close. No retroactive contribution claims.',
      },
      {
        id: 'equity-ownership',
        label: 'Equity & Ownership',
        type: 'grid',
        prompt: 'The ownership table. Defines who holds equity in the underlying entity, in what proportion, and with what vesting treatment. ENTIRELY SEPARATE from the project profit split — equity is ownership of the venture itself; profit split is earnings from a specific piece of work. Founders vest immediately. Founding Members vest over 4 years with a 1-year cliff. Contributor-track partners have no equity at start. Equity percentages MUST sum to 100% INCLUDING the Equity Incentive Pool.',
        columns: [
          { id: 'partner',         label: 'Partner',            hint: 'Partner name OR "Equity Incentive Pool"' },
          { id: 'equityPct',       label: 'Equity %',           hint: 'Numeric percentage. Must sum to 100% across all rows.' },
          { id: 'vestingTreatment',label: 'Vesting treatment',  hint: 'Immediate (Founder) · 4-yr vest 1-yr cliff (Founding Member) · Pool grant · Eligible via Pool after Gates pass' },
        ],
        targetRows: 5,
      },
      {
        id: 'equity-pool',
        label: 'Equity Incentive Pool',
        type: 'prose',
        prompt: 'A block of ownership held in reserve for future partners and long-term contributors. Default 20% (range 10–30%). The Pool sits ALONGSIDE founder equity — its existence does NOT dilute founders below their stated percentages. Grants from the Pool are discretionary, performance-based, and require Managing Member written approval. The Pool refills automatically when partners leave before fully vesting — unvested equity reverts to the Pool, not to other partners. Confirm the standard restriction: "Equity reserved for future partners, executives, or long-term contributors. The Managing Member has sole authority to approve a sale, merger, or issuance of equity from the Pool."',
      },
      {
        id: 'vesting',
        label: 'Vesting Mechanics',
        type: 'fields',
        prompt: 'The vesting schedule, cliff, and what happens to unvested equity on departure. Founders vest immediately. Founding Members and Pool grantees: 4 years total, 1-year cliff. After cliff, vesting continues monthly (1/48th per month) OR annually (25% per year). On departure: vested equity stays with the departing partner as outside shareholder; unvested equity returns to the Pool. Accelerated vesting is OFF by default; if enabled, double-trigger required (change of control AND termination without cause).',
        fields: [
          { id: 'vestingYears',          label: 'Vesting period (years)',    hint: 'Default 4. Range 2 – 6.' },
          { id: 'cliffMonths',           label: 'Cliff (months)',            hint: 'Default 12. Range 0 – 24.' },
          { id: 'vestingCadence',        label: 'Vesting cadence',           hint: 'Monthly (1/48 per month) · Annual (25% per year)' },
          { id: 'acceleratedVesting',    label: 'Accelerated vesting on CoC',hint: 'OFF (default) · Single-trigger · Double-trigger' },
          { id: 'poolRefillRule',        label: 'Pool refill rule',          hint: 'Unvested equity returns to Pool on departure' },
        ],
      },
      {
        id: 'promotion-pathway',
        label: 'Promotion Pathway',
        type: 'prose',
        prompt: 'The route by which a contributor-track partner becomes an equity holder. NOT automatic. Requires (a) passing all three Eligibility Gates and (b) a discretionary equity grant from the Managing Member, drawn from the Equity Incentive Pool. Standard promotion grant: 3–5% from the Pool, subject to standard 4-year, 1-year cliff vesting. The majority of contributor-track compensation continues to flow through the project profit split, NOT through equity. Include the guard clause: "Future equity grants are discretionary, performance-based, and subject to Managing Member approval. No equity is earned or implied absent a written grant agreement."',
      },
      {
        id: 'eligibility-gates',
        label: 'Eligibility Gates',
        type: 'fields',
        prompt: 'Three-gate test for equity eligibility. CONJUNCTIVE — all three must be passed. Gate A: Time Commitment — minimum 12 consecutive months of active contribution. Gate B: Consistent Participation — participated in at least 70–80% of projects over the qualifying period. Gate C: Revenue Impact — directly contributed to projects generating a documented minimum revenue threshold (default $50K cumulative). Passing all three makes a contributor ELIGIBLE to be considered; it does not entitle them to equity. Gate thresholds are adjustable in the Develop panel for the scale of the venture.',
        fields: [
          { id: 'gateAMonths',     label: 'Gate A · Time commitment (months)',  hint: 'Minimum consecutive months of active contribution. Default 12.' },
          { id: 'gateBPct',        label: 'Gate B · Participation (%)',         hint: 'Minimum % of projects participated in. Default 70.' },
          { id: 'gateCRevenue',    label: 'Gate C · Revenue threshold ($)',     hint: 'Minimum documented cumulative revenue. Default 50000.' },
          { id: 'documentation',   label: 'Documentation requirement',          hint: 'How contribution must be evidenced — projects, clients, releases' },
        ],
      },
      {
        id: 'governance',
        label: 'Governance — Managing Member authority',
        type: 'prose',
        required: true,
        prompt: 'Defines who has authority to make binding decisions. Default model: strong Managing Member — one named partner holds unilateral authority over specific reserved matters, other partners hold consent rights only where reserved. Matters reserved to the Managing Member: sale or merger of the venture · issuance of new equity (including grants from the Pool) · admission of new partners · execution of debt instruments above a threshold (default $25K) · winding up the venture. Matters requiring unanimous partner consent (constitutional clauses): changes to profit-split percentages · changes to the equity table · changes to the Eligibility Gates · changes to the Managing Member role itself. Day-to-day operating decisions sit with the Managing Member or their delegates.',
      },
      {
        id: 'execution',
        label: 'Execution',
        type: 'grid',
        prompt: 'Signature blocks for each partner. Every partner signs in their own capacity. Partners signing on behalf of a holding entity include both the entity name AND the individual signatory\'s title. The Managing Member signs TWICE — once in their personal capacity (as a partner), once in their capacity as Managing Member (binding the venture itself). Signature dates may differ; the Effective Date in Cover governs when economic clocks start.',
        columns: [
          { id: 'partner',         label: 'Partner',            hint: 'Partner name (Managing Member appears twice — once personal, once "as Managing Member")' },
          { id: 'signatoryName',   label: 'Signatory name',     hint: 'Name of the person signing' },
          { id: 'capacity',        label: 'Capacity',           hint: 'Partner · Managing Member · Authorised Signatory · (an individual)' },
          { id: 'signatureDate',   label: 'Signature date',     hint: 'YYYY-MM-DD' },
        ],
        targetRows: 6,
      },
    ],
    systemPrompt: 'You are filling a Partnership Profit & Equity Split agreement. Use the 12-section structure in order. Do not merge sections. STRICTLY separate profit-split (per-project, contribution-based) from equity (ownership, time-based). Validate that profit-split percentages sum to 100% with at least 20% allocated to the Operating Reserve. Validate that equity percentages sum to 100% INCLUDING the Equity Incentive Pool (default 20%). Founders vest immediately; Founding Members vest 4 years with 1-year cliff; Contributor-track partners have no equity at incorporation. The Eligibility Gates (Time / Participation / Revenue) are CONJUNCTIVE — never generate "or" between them. Name exactly ONE Managing Member; halt and prompt if none designated. Preserve the canonical Reserve Mechanics wording: "Profit participation is project-based and contingent upon material contribution. Any unearned profit allocation shall revert to the Company\'s operating reserve and shall not be redistributed to other participants." This is a structural template, not legal or financial advice — a qualified lawyer in the relevant jurisdiction must review before execution.',
  },
];

/* ─── Model schema prompt builders ──────────────────────────────
   These helpers translate a Model's structured schema into:
     1. A natural-language prompt that teaches Claude exactly what
        JSON shape to return per section type
     2. Default values used as fallbacks if Claude's response can't
        be parsed or omits a section

   Section type → JSON shape mapping:
     prose      → string
     list       → string (one bulleted line per row, each starts with —)
     fields     → object { fieldId: string, ... }
     grid       → array of { columnId: string, ... }
     checklist  → array of { text: string, checked: false }
     repeating  → array of { subFieldId: string, ... }
   ────────────────────────────────────────────────────────────────── */

export {
  CONTACTS_DATA, EVENTS_DATA, VENUES_DATA,
  FUNCTIONS_CATEGORIES, FUNCTIONS_INTELLIGENCE, MODELS,
};

#### Before using these files, you must first register [BioASQ website](http://participants-area.bioasq.org) and download the **[`BioASQ Task B`](http://participants-area.bioasq.org/Tasks/A/getData/)** data. See in https://github.com/dmis-lab/biobert for details

## Psudo-golden & SQuAD format datasets for BioASQ challenge

We made psudo-golden test datasets by adding exact answers to original test datasets.
<br>We extracted exact_answer from train dataset of (N+1)b task to make (N)b task test dataset.
<br>Files named as (N)b(K)_golden.json are psudo-golden datasets.
<br>
<br>Some questions (such as id : 571e4523bb137a4b0c00000c from 4B5-testset) didn't have answer on 5b train dataset.
<br>In this case, we put " " (a blank space) as exact_answer.


## License 
### BioASQ
Before using this files, you must first register BioASQ website and download the **[`BioASQ Task B`](http://participants-area.bioasq.org/Tasks/A/getData/)** data.
Thanks to BioASQ project team for the data and see **An overview of the BIOASQ large-scale biomedical semantic indexing and question answering competition (Tsatsaronis et al. 2015)** for datasets details.

### PubMed
Downloading data indicates your acceptance of the <a href="https://www.nlm.nih.gov/databases/download/terms_and_conditions.html">Terms and Conditions</a> from National Library of Medicine Terms and Conditions.
<br>Our data is no longer updated since 2018.Dec.31st and it may not reflect current data avauilable from NLM











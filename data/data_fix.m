%% Social Data Visualization Project - Data processing
clc; clear; close all;

data = readtable('complaint_sample2.csv');
incidents = zeros(5,1);

for i=1:height(data)
    if isequal(data{i,7}{1},'BRONX')
        incidents(1) = incidents(1)+1;
    elseif isequal(data{i,7}{1},'BROOKLYN')
        incidents(2) = incidents(2)+1;
    elseif isequal(data{i,7}{1},'MANHATTAN')
        incidents(3) = incidents(3)+1;
    elseif isequal(data{i,7}{1},'QUEENS')
        incidents(4) = incidents(4)+1;
    elseif isequal(data{i,7}{1},'STATEN ISLAND')
        incidents(5) = incidents(5)+1;
    end
end

% Normalize using citypopulation data
% https://www.citypopulation.de/php/usa-newyorkcity.php
population = [1.471160; 2.648771; 1.664727; 2.358582; 0.479458];
inc_pr_mil = incidents./population;

boroughs = cell2table({'BRONX','BROOKLYN','MANHATTAN','QUEENS','STATEN ISLAND'}');

% Convert to table to export
inc_pr_bo = array2table(incidents);
inc_pr_bo_norm = array2table(inc_pr_mil);

inc_pr_bo{:,2} = inc_pr_bo_norm{:,1};
inc_pr_bo{:,3} = boroughs{:,1};
inc_pr_bo.Properties.VariableNames = {'Incidents' 'Incidents_Norm' 'Borough'}; 
writetable(inc_pr_bo,'incidents.csv');

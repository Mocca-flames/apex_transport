$c = Get-Content index.html
$first = $c[0..1637]
$rest = $c[2395..($c.Length-1)]
$insert = @(
'            /* Mobile Coverage Header spacing */'
'            .coverage-header .section-title {'
'                margin-bottom: 0;'
'            }'
)
$new = $first + $insert + $rest
$new | Set-Content index.html

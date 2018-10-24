#!/usr/bin/perl -w
# Author: Jack Jiang
# Documentation: https://github.com/Jiangyiqun/GitLog2Diary
use POSIX qw(strftime);

# global varibles
my @start;
my @stop;
my @comments;
my $author = "";
$author = shift @ARGV if @ARGV;

# convert epoc to time string
sub epoc_to_time {
    my $epoc = shift @_;
    $time = strftime "%d/%m %R", localtime($epoc);
    return $time;
}


# parse git log
my @git_log = `git log --author="$author" --pretty=format:"%ct %s"
`;
my $total_minutes = 0;
foreach my $log (@git_log) {
    if ($log =~ m|(^\d{10}) (\d\d):(\d\d) (.*$)|) {
        # generate stop time
        my $stop_epoc = $1;
        unshift @stop, epoc_to_time($stop_epoc);
        # generate start time
        my $hour = $2;
        my $minute = $3;
        my $start_epoc = $stop_epoc - 3600 * $hour - 60 * $minute;
        unshift @start, epoc_to_time($start_epoc);
        # generate comment
        my $comment = $4;
        unshift @comments, $comment;
        # add up total minutes
        $total_minutes += 60 * $hour + $minute;
    } else {
        $log =~ m|(^\d{10}) (.*$)|;
        # generate stop time
        my $stop_epoc = $1;
        unshift @stop, epoc_to_time($stop_epoc);
        # generate start time
        unshift @start, "Null       ";
        # generate comment
        my $comment = $2;
        unshift @comments, $comment;
    }
}


# print title
if ($author) {
    print "# $author\'s Diary\n\n";
} else {
    print "# This Diary\n\n";
}
# print Author
my $user = `echo \$USER`;
print "- Author: $user";
# print Date
my $current_time = strftime "%a %b %e %H:%M:%S %Y", localtime();
print "- Date: $current_time\n";
# print generate information
print "- Generated\n";
my $host = `hostname`;
my $repo = 'https://github.com/Jiangyiqun/GitLog2Diary';
print "    - at $host";
print "    - by $repo\n\n";


# print the diary
print "Start Time  |Stop Time   |Comments                                      \n";
print "------------|------------|----------------------------------------------\n";
foreach my $i (0..scalar @start - 1) {
    print "$start[$i] |$stop[$i] |$comments[$i]\n";
}

# print the summery
my $hour = int($total_minutes / 60);
my $minute = $total_minutes % 60;
print "\nSummery: $hour hours and $minute minutes\n";
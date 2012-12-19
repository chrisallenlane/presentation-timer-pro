desc "Greps for notes in the project source."
task :find_todos do
    puts `ack-grep '@todo' ./assets/www`
    puts `ack-grep '@bug' ./assets/www`
    puts `ack-grep '@kludge' ./assets/www`
end

desc "Builds a release version of the application."
task :build do
    puts 'Building a debug apk...'
    #puts `./cordova/clean`
    #puts `./cordova/debug`
    puts `ant clean`
    puts `ant debug`

end
